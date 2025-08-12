import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  TableContainer,
} from "@mui/material";
import { initialUploads } from "../constants/dummy-uploads";
import { UploadForm } from "../components/admin/upload-form";
import { ResourcesTable } from "../components/admin/resources-table";

export interface UploadedResource {
  title: string;
  subject: string;
  format: string;
  source: string;
  fileName: string;
  uploadDate: string;
}

export const AdminPage: React.FC = () => {
  const [uploads, setUploads] = useState<UploadedResource[]>([]);

  useEffect(() => {
    setUploads(initialUploads);
  }, []);

  const addUpload = (newUpload: UploadedResource) => {
    setUploads((prev) => [newUpload, ...prev]);
  };

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