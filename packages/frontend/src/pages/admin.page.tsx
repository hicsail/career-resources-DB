import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress
} from "@mui/material";
import { UploadForm } from "../components/admin/upload-form";
import { ResourcesTable } from "../components/admin/resources-table";
import { useApiServices } from '../services/api';
//import { getAllDocumentMetadata } from "../services/api";

export interface UploadedResource {
  title: string;
  subject: string;
  format: string;
  source: string;
  PDFName: string;
  uploadedAt: string;
  link: string;
}

export const AdminPage: React.FC = () => {
  const [uploads, setUploads] = useState<UploadedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const { getAllDocumentMetadata } = useApiServices();

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

      <Typography variant="h4" gutterBottom sx={{ mt: 6 }} align="center">
        Uploaded Resources
      </Typography>

      {loading && (
        <Typography align="center" mt={4}>
          <CircularProgress />
        </Typography>
      )}

      {!loading && (
        <ResourcesTable uploads={uploads} />
      )}
    </Container>
  );
};