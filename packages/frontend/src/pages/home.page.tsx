import React, { FC, useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import { SearchForm } from '../components/search-form';
import { ResultsList } from '../components/result-list';
import { searchResources } from '../services/api';
import { tags } from '../constants/tags';

import type { SearchResultType } from '../services/api';

export const HomePage: FC = () => {
  const [results, setResults] = useState<[SearchResultType[]]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async ({
    keyword,
    tag,
  }: {
    keyword: string;
    tag?: string;
  }) => {
    console.log('keyword:', keyword, 'tag:', tag);
    setLoading(true);
    try {
      const data = await searchResources(keyword, tag); 
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom>
        🔍 Career Resource Search
      </Typography>

      <SearchForm onSearch={handleSearch} tags={tags} />

      {loading && (
        <Typography align="center" mt={4}>
          <CircularProgress />
        </Typography>
      )}

      {!loading && results.length > 0 && <ResultsList data={results} />}

      {!loading && results.length === 0 && (
        <Typography align="center" mt={4} color="text.secondary">
          No results to display.
        </Typography>
      )}
    </Container>
  );
};