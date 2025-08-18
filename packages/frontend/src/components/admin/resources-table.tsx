import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";
import type { UploadedResource } from "../../pages/admin.page";
import Badge from '../badge';

interface ResourcesTableProps {
  uploads: UploadedResource[];
}

export const ResourcesTable: React.FC<ResourcesTableProps> = ({ uploads }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // default rows per page

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page when rows per page changes
  };

  if (uploads.length === 0) {
    return (
      <Typography color="text.secondary">No uploaded resources yet.</Typography>
    );
  }

  const paginatedUploads = uploads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          height: 400,       
          overflowY: "auto"
        }}
      >
        <Table stickyHeader aria-label="resources table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Resource Title</strong></TableCell>
              <TableCell><strong>Subject Tag</strong></TableCell>
              <TableCell><strong>Format Tag</strong></TableCell>
              <TableCell><strong>Source Tag</strong></TableCell>
              <TableCell><strong>File Name</strong></TableCell>
              <TableCell><strong>Upload Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUploads && paginatedUploads.map((upload, idx) => (
              <TableRow key={idx}>
                <TableCell>{upload.title}</TableCell>
                <TableCell>
                  <Badge label={upload.subject} fallback="No subject available" />
                </TableCell>
                <TableCell>
                  <Badge label={upload.format} fallback="No subject available" />
                </TableCell>
                <TableCell>
                  <Badge label={upload.source} fallback="No subject available" />
                </TableCell>
                <TableCell>{upload.PDFName}</TableCell>
                <TableCell>{upload.uploadedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={uploads.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};