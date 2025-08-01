import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Pagination,
  Link,
  Chip,
} from '@mui/material';

interface Props {
  data: any[];
}

export const ResultsList: React.FC<Props> = ({ data }) => {
  const itemsPerPage = 5;
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

            {item.tag ? (
              <Chip
                label={item.tag}
                color="primary"
                size="small"
                sx={{ mb: 1 }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                No tag available.
              </Typography>
            )}

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