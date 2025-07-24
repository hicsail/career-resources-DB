const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const pdf = require("pdf-parse");
const keywordExtractor = require("keyword-extractor");

const TABLE_NAME = "ResourceIndex";

exports.handler = async (event) => {
  console.log("Lambda triggered!");

  try {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    console.log("Bucket:", bucket);
    console.log("Key:", key);

    if (!key.toLowerCase().endsWith(".pdf")) {
      console.warn("Not a PDF file:", key);
      return { statusCode: 400, body: "File is not a PDF." };
    }

    const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    let text;
    try {
      const pdfData = await pdf(s3Object.Body);
      text = pdfData.text;
      console.log("PDF text extracted successfully");
    } catch (parseError) {
      console.error("Failed to parse PDF", parseError);
      throw new Error("Invalid or corrupt PDF file.");
    }

    const rawKeywords = keywordExtractor.extract(text, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });

    console.log("Extracted keywords:", rawKeywords);

    const keywords = rawKeywords.slice(0, 30);
    const keywordCounts = rawKeywords.reduce((acc, word) => ({ 
      ...acc, 
      [word]: (acc[word] || 0) + 1 
    }), {});
    
    const documentId = uuidv4();

    const document = {
      _id: documentId,
      title: key.split("/").pop(),
      s3Key: key,
      s3Bucket: bucket,
      keywords,
      uploadedAt: new Date().toISOString(),
    };

    console.log("Storing document in DynamoDB:", JSON.stringify(document, null, 2));

    await dynamodb
      .put({
        TableName: TABLE_NAME,
        Item: document,
      })
      .promise();

    console.log("Successfully indexed document:", documentId);

    await Promise.all(
      Object.entries(keywordCounts).map(async ([keyword, count]) => {
        await dynamodb.put({
          TableName: "KeywordIndex",
          Item: {
            _id:uuidv4(),
            keyword,
            count,
            documentId,
            title: document.title,
            s3Key: key,
            s3Bucket: bucket,
            uploadedAt: new Date().toISOString(),
          },
        }).promise();
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Indexed successfully", documentId }),
    };
  } catch (err) {
    console.error("Error indexing PDF:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "PDF indexing failed", details: err.message }),
    };
  }
};