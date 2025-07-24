import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField } from '@mui/material';

interface Props {
  onSearch: (filters: { keyword: string }) => void;
}

export const SearchForm: React.FC<Props> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch({ keyword });
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Search for a document"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};