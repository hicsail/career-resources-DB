# Implementation of Career Resources Database 

## Overview 
The purpose of this project is to build a searchable database of career resource documents, enabling users to search for phrases and keywords across the entire collection. Search results can be further refined by applying filters based on metadata and tags (e.g., publication year, format, source, subject).

This project implements a complete pipeline for **document ingestion, indexing, and search**. 
The ingestion step involves reading the file, extracting its contents/metadata, generating an ID based on the hashed content, and storing structured data in **AWS DynamoDB tables**.

## Document Indexing Pipeline

The pipeline for indexing documents consists of the following steps:  

1. **Uploading Documents to AWS S3**  
   - Documents, along with their metadata, are uploaded to an S3 bucket.  
   - Uploading can be done either:  
     - Using a Python script for bulk uploads from file download links.  
     - Through the **admin interface** of the application via the UI.  

2. **Triggering the Lambda Function**  
   - Uploading a document automatically triggers an **AWS Lambda function**.  
   - The Lambda function generates a **unique document ID** using a hash of the file content.  
   - It **reads and parses** the document to extract text and metadata.  
   - Extracted information is then **stored in DynamoDB tables**, including document metadata and keyword mappings for efficient search and retrieval.

This setup enables scalable, serverless indexing of documents with flexible querying capabilities.  

---

## Project Structure  

```
.
├── lambda-indexer/         # The zipped version of this directory is uploaded to AWS lambda.
│   └── index.js            # Lambda function triggered on S3 uploads
│
├── packages/               # Application code 
│   ├── backend/            # API service (upload, search, filter, query documents)
│   └── frontend/           # User-facing UI to perform document searches
│
├── python-scripts/         # Python scripts for bulk upload and dynamo db table CRUD operation helpers 
│   ├── src                 
│     └── main.py           # Python script to bulk upload docuemnts from google drive links in spreadsheet to S3 
│
└── README.md               # Project documentation
```

- **lambda/indexer**  
  Contains the AWS Lambda function. Triggered whenever a new file is uploaded to the S3 bucket. Parses PDF files, extracts metadata/keywords, and writes to DynamoDB tables.  

- **packages/backend**  
  Contains the backend service (Nest.js) that exposes search/filter APIs.  

- **packages/frontend**  
  Contains the frontend (React) for searching and displaying documents.  

- **scripts/**  
  Python scripts to preprocess and bulk upload documents into S3, which in turn triggers the Lambda for indexing.  

---

## DynamoDB Tables  

The project uses **4 DynamoDB tables** to manage document metadata, keywords, and logs.  

### 1. **document-metadata**  
Stores high-level metadata about each document.  

- **Partition key:** `documentId`  
- **Attributes:**  
  - `PDFName` – Original file name  
  - `s3Key` – Path to file in S3  
  - `s3Bucket` – S3 bucket name  
  - `uploadedAt` – ISO timestamp when file was indexed  
  - `title` – Title of document  
  - `subject` – Subject  
  - `format` – File/document format  
  - `source` – Document source  
  - `publicationYear` – Year of publication  
  - `countryState` – Country or state metadata  
  - `link` – External link associated with document  
  - `queryAll` – Boolean flag to enable broad search  

---

### 2. **document-keyword-mapping**  
Maps a single document to all of its extracted keywords.  

- **Partition key:** `documentId`  
- **Attributes:**  
  - `keywords` – Array of keywords extracted from the document  
  - `uploadedAt` – Timestamp  
  - `title` – Document title  
  - `s3Key`, `s3Bucket` – Location in S3  

This table is used only for debugging parsing errors and is not queried directly.

---

### 3. **keyword-index**  
Inverted index mapping each keyword to documents.  

- **Partition key:** `keyword`  
- **Sort key:** `documentId`  
- **Attributes:**  
  - `count` – Frequency of the keyword in the document  
  - `title` – Document title  
  - `uploadedAt` – Timestamp  
  - `s3Key`, `s3Bucket` – File location  

This table enables **efficient search queries** like “find all documents containing the keyword X.”  

---

### 4. **document-index-log**  
Tracks the indexing history and errors.  

- **Partition key:** `documentId`  
- **Sort key:** `uploadedAt`  
- **Attributes:**  
  - `fileName` – Name of uploaded file  
  - `status` – `success` or `failure`  
  - `errorMessage` – Error details if parsing failed  

This table provides observability into indexing jobs.  

---

## Indexing Workflow  

1. **Upload**: A PDF is uploaded to the S3 bucket.  
2. **Lambda Triggered**: S3 event triggers the `indexer` Lambda.  
3. **Validation**:  
   - Non-PDF files are rejected.  
   - Corrupt PDFs are logged as failures.  
4. **Processing**:
   - Generates a unique identifier for each document using a hash of its content.
   - Extracts text using `pdf-parse`.  
   - Extracts keywords using `keyword-extractor`.  
   - Counts keyword occurrences.  
6. **Database Updates**:  
   - Stores metadata in `document-metadata`.  
   - Stores keywords in `document-keyword-mapping`.  
   - Builds inverted index in `keyword-index`.  
   - Logs success/failure in `document-index-log`.  
7. **Search**:  
   - The frontend and backend query the `keyword-index` and `document-metadata` tables to return filtered results to users.  

---

## Example Query Flow  

- A user searches for `"career development"` in the frontend.  
- Backend queries `keyword-index` to find all `documentId`s containing `climate` and `policy`.  
- Joins results with `document-metadata` to apply filters (e.g., `publicationYear > 2015`, `countryState = USA`).  
- Returns a list of matching documents with metadata and S3 links.  

---
