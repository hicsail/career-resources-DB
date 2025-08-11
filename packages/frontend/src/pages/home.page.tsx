import React, { FC, useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import { SearchForm } from '../components/search-form';
import { ResultsList } from '../components/result-list';
import { searchResources } from '../services/api';
import { subjects } from '../constants/subjects';
import { formats } from '../constants/formats';
import { sources } from '../constants/sources';
import type { SearchFiltersType } from '../types/search';
import type { SearchResultType } from '../types/search';

export const HomePage: FC = () => {
  const [results, setResults] = useState<[SearchResultType[]]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async ({
    phrase,
    subject,
    format,
    source
  }: SearchFiltersType) => {    
    setLoading(true);
    try {
      const data = await searchResources(phrase, subject, format, source); 
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

      <SearchForm 
        onSearch={handleSearch} 
        subjects={subjects}
        formats={formats}
        sources={sources} 
      />

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