const AWS = require("aws-sdk");
const crypto = require("crypto");
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const pdf = require("pdf-parse");
const keywordExtractor = require("keyword-extractor");

const METADATA_TABLE = "document-metadata"; // Partition key: documentId
const KEYWORD_INDEX_TABLE = "keyword-index"; // Partition key: keyword, Sort key: documentId
const LOG_TABLE = "document-index-log"; // Partition key: documentId, Sort key: uploadedAt

// Helper function to log status
async function logStatus(documentId, fileName, status, errorMessage = "") {
  return dynamodb.put({
    TableName: LOG_TABLE,
    Item: {
      documentId,
      uploadedAt: new Date().toISOString(),
      fileName,
      status,
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

  if (!key.toLowerCase().endsWith(".pdf")) {
    await logStatus(generateDocumentId(key), key.split("/").pop(), "failure", "Not a PDF file");
    return { statusCode: 400, body: "File is not a PDF." };
  }

  const documentId = generateDocumentId(key);
  const title = key.split("/").pop();
  const uploadedAt = new Date().toISOString();

  try {
    const { Body, Metadata } = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    // Extract PDF text
    let text;
    try {
      const pdfData = await pdf(Body);
      text = pdfData.text;
    } catch (parseError) {
      await logStatus(documentId, title, "failure", "Invalid or corrupt PDF");
      return { statusCode: 400, body: "Invalid or corrupt PDF file." };
    }

    // Extract keywords
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

    // Upsert document metadata
    await dynamodb.update({
      TableName: METADATA_TABLE,
      Key: { documentId },
      UpdateExpression: `
        SET PDFName = :pdfName,
            s3Key = :s3Key,
            s3Bucket = :s3Bucket,
            uploadedAt = :uploadedAt,
            title = :title,
            #subject = :subject,
            #format = :format,
            #source = :source,
            publicationYear = :publicationYear,
            countryState = :countryState,
            link = :link,
            queryAll = :queryAll,
            keywords = :keywords
      `,
      ExpressionAttributeNames: {
        "#format": "format",
        "#subject": "subject",
        "#source": "source"
      },
      ExpressionAttributeValues: {
        ":pdfName": title,
        ":s3Key": key,
        ":s3Bucket": bucket,
        ":uploadedAt": uploadedAt,
        ":title": Metadata.title || "",
        ":subject": Metadata.subject || "",
        ":format": Metadata.format || "",
        ":source": Metadata.source || "",
        ":publicationYear": Metadata.publication_year || "",
        ":countryState": Metadata.country_state || "",
        ":link": Metadata.link || "",
        ":queryAll": "true",
        ":keywords": keywords.length > 0 ? keywords : []
      },
      ReturnValues: "ALL_NEW"
    }).promise();

    // Index each keyword in keyword-index table
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
            s3Bucket: bucket
          }
        }).promise()
      )
    );

    // Log success
    await logStatus(documentId, title, "success");

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