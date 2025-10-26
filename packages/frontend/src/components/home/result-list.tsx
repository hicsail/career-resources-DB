import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Pagination,
  Link
} from '@mui/material';
import Badge from '../badge';

interface ResultItem {
  title?: string;
  subject?: string;
  source?: string;
  format?: string;
  link?: string;
}

interface Props {
  data: ResultItem[];
}

export const ResultsList: React.FC<Props> = ({ data }) => {
  const itemsPerPage = 15;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box maxWidth="800px" mx="auto" mt={6}>
      {currentItems.map((item, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {item.title || 'Untitled Document'}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1}>
              <Badge label={item.subject} fallback="No subject available" />
              <Badge label={item.source} fallback="No source available" />
              <Badge label={item.format} fallback="No format available" />
            </Box>

            {item.link && (
              <Box mt={1}>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  Download Document
                </Link>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};