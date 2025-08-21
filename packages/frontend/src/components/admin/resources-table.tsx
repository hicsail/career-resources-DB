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
  Tooltip,
  Box
} from "@mui/material";
import type { UploadedResource } from "../../pages/admin.page";
import Badge from "../badge";

interface ResourcesTableProps {
  uploads: UploadedResource[] | null;
}

export const ResourcesTable: React.FC<ResourcesTableProps> = ({ uploads }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!uploads || uploads.length === 0) {
    return <Typography color="text.secondary">No results to show.</Typography>;
  }

  const paginatedUploads = uploads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Calculate row height to fix table height
  const totalTableHeight = 60 * rowsPerPage; // 60px per row as before

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          maxHeight: totalTableHeight + 56, // add header height ~56px
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table stickyHeader aria-label="resources table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 200, fontWeight: "bold" }}>Resource Title</TableCell>
              <TableCell sx={{ minWidth: 120, fontWeight: "bold" }}>Subject Tag</TableCell>
              <TableCell sx={{ minWidth: 120, fontWeight: "bold" }}>Format Tag</TableCell>
              <TableCell sx={{ minWidth: 120, fontWeight: "bold" }}>Source Tag</TableCell>
              <TableCell sx={{ minWidth: 180, fontWeight: "bold" }}>File Name</TableCell>
              <TableCell sx={{ minWidth: 120, fontWeight: "bold" }}>Upload Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedUploads.map((upload, idx) => (
              <TableRow 
                key={idx} 
                sx={{
                  height: 60,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <Tooltip title={upload.title || ""} arrow>
                    <Box component="div" sx={{ display: "block" }}>
                      {upload.title}
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Badge label={upload.subject} fallback="No subject" />
                </TableCell>
                <TableCell>
                  <Badge label={upload.format} fallback="No format" />
                </TableCell>
                <TableCell>
                  <Badge label={upload.source} fallback="No source" />
                </TableCell>

                <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <Tooltip title={upload.PDFName || ""} arrow>
                    <span>{upload.PDFName}</span>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  {upload.uploadedAt
                    ? new Date(upload.uploadedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </TableCell>
              </TableRow>
            ))}

            {/* Add an invisible row to keep table height consistent if fewer rows */}
            {paginatedUploads.length < rowsPerPage && (
              <TableRow sx={{ height: 60 * (rowsPerPage - paginatedUploads.length), visibility: "hidden" }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
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