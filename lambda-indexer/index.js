const AWS = require("aws-sdk");
const crypto = require("crypto");
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const pdf = require("pdf-parse");
const keywordExtractor = require("keyword-extractor");

const METADATA_TABLE = "document-metadata";
const KEYWORD_INDEX_TABLE = "keyword-index";
const LOG_TABLE = "document-index-log"; 

// Helper function to log status
async function logStatus(documentId, fileName, status, errorMessage = "") {
  return dynamodb.put({
    TableName: LOG_TABLE,
    Item: {
      documentId,
      uploadedAt: new Date().toISOString(),
      fileName,
      status,         // "success" or "failure"
      errorMessage
    }
  }).promise();
}

// Generate deterministic documentId using SHA-256 hash
function generateDocumentId(s3Key) {
  return crypto.createHash("sha256").update(s3Key).digest("hex");
}

exports.handler = async (event) => {
  console.log("Lambda triggered!");

  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

  console.log("Bucket:", bucket);
  console.log("Key:", key);

  if (!key.toLowerCase().endsWith(".pdf")) {
    console.warn("Not a PDF file:", key);
    return { statusCode: 400, body: "File is not a PDF." };
  }

  // Deterministic documentId to avoid duplicates
  const documentId = generateDocumentId(key);
  const title = key.split("/").pop();
  const uploadedAt = new Date().toISOString();

  try {
    const { Body, Metadata } = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    let text;
    try {
      const pdfData = await pdf(Body);
      text = pdfData.text;
      console.log("PDF text extracted successfully");
    } catch (parseError) {
      console.error("Failed to parse PDF", parseError);
      await logStatus(documentId, title, "failure", "Invalid or corrupt PDF");
      return { statusCode: 400, body: "Invalid or corrupt PDF file." };
    }

    const keywords = keywordExtractor.extract(text, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });

    const keywordCounts = keywords.reduce((acc, word) => ({
      ...acc,
      [word]: (acc[word] || 0) + 1
    }), {});

    // Insert into document-metadata table
    const documentMetadata = {      
      documentId, // deterministic hash ID
      PDFName: title,
      s3Key: key,
      s3Bucket: bucket,
      uploadedAt,    
      title: Metadata.title || "",
      subject: Metadata.subject || "",
      format: Metadata.format || "",
      source: Metadata.source || "",
      publicationYear: Metadata.publication_year || "",
      countryState: Metadata.country_state || "",
      link: Metadata.link || "",
      queryAll: "true"        
    };

    console.log("Storing document metadata...");
    await dynamodb.put({
      TableName: METADATA_TABLE,
      Item: documentMetadata
    }).promise();

    // Insert keyword entries
    console.log("Indexing keywords...");
    await Promise.all(
      Object.entries(keywordCounts).map(([keyword, count]) =>
        dynamodb.put({
          TableName: KEYWORD_INDEX_TABLE,
          Item: {
            keyword,
            documentId,
            count,
            title,
            uploadedAt,            
            s3Key: key,
            s3Bucket: bucket,
          }
        }).promise()
      )
    );

    // log success
    await logStatus(documentId, title, "success");
    console.log("Successfully indexed document:", documentId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Indexed successfully", documentId }),
    };

  } catch (err) {
    console.error("Error indexing PDF:", err);
    await logStatus(documentId, title, "failure", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "PDF indexing failed", details: err.message }),
    };
  }
};