import { FC, useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { SearchForm } from '../components/home/search-form';
import { ResultsList } from '../components/home/result-list';
import { subjects } from '../constants/subjects';
import { formats } from '../constants/formats';
import { states } from '../constants/states';
import { countries } from '../constants/countries';
import type { SearchFiltersType } from '../types/search';
import type { SearchResultType } from '../types/search';
import { useApiServices } from '../services/api';

export const HomePage: FC = () => {
  const [results, setResults] = useState<SearchResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchResources, getAllDocumentMetadata } = useApiServices();
  
  const handleSearch = async ({
    phrase,
    subjects,
    formats,
    sources,
    startYear,
    endYear,
    state,
    country
  }: SearchFiltersType) => {    
    setLoading(true);
    try {
      const location = country || state;
      const data = await searchResources(phrase, subjects, formats, sources, startYear, endYear, location); 
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const data = await getAllDocumentMetadata();
      setResults(data); 
    } catch (err) {
      console.error(err);
      setError("Failed to fetch document metadata.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {   
    fetchMetadata();
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 2, pb:2  }}>
      <Typography variant="h3" align="center" gutterBottom>
        🔍 Career Resource Search
      </Typography>

      <SearchForm 
        onSearch={handleSearch} 
        subjects={subjects}
        formats={formats}
        states={states} 
        countries={countries} 
      />

      {loading && (
        <Typography align="center" mt={4}>
          <CircularProgress />
        </Typography>
      )}

      {!loading && results.length > 0 && <ResultsList data={results} />}

      {!loading && results.length === 0 && (
        <Box textAlign="center" mt={6}>
          <SearchOffIcon sx={{ fontSize: 60, color: "grey.500" }} />
          <Typography mt={2} color="text.secondary">
            No results found.
          </Typography>
        </Box>
      )}
    </Container>
  );
};