import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
} from "@mui/material";
import { UploadForm } from "../components/admin/upload-form";
import { ResourcesTable } from "../components/admin/resources-table";
import { getAllDocumentMetadata } from "../services/api";

export interface UploadedResource {
  title: string;
  subject: string;
  format: string;
  source: string;
  PDFName: string;
  uploadedAt: string;
}

export const AdminPage: React.FC = () => {
  const [uploads, setUploads] = useState<UploadedResource[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const data = await getAllDocumentMetadata();
      setUploads(data); 
    } catch (err) {
      console.error(err);
      setError("Failed to fetch document metadata.");
    } finally {
      setLoading(false);
    }
  };

  const addUpload = (newUpload: UploadedResource) => {
    setUploads((prev) => [newUpload, ...prev]);
  };

  useEffect(() => {   
    fetchMetadata();
  }, []);
  
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Resource Upload
      </Typography>

      <UploadForm addUpload={addUpload} />

      <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
        Uploaded Resources
      </Typography>

      <ResourcesTable uploads={uploads} />
    </Container>
  );
};