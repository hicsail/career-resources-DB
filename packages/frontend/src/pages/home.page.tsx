import { FC, useState } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { SearchForm } from '../components/home/search-form';
import { ResultsList } from '../components/home/result-list';
//import { searchResources } from '../services/api';
import { subjects } from '../constants/subjects';
import { formats } from '../constants/formats';
import { sources } from '../constants/sources';
import type { SearchFiltersType } from '../types/search';
import type { SearchResultType } from '../types/search';
import { useApiServices } from '../services/api';

export const HomePage: FC = () => {
  const [results, setResults] = useState<SearchResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchResources } = useApiServices();
  const [selectedFilters, setSelectedFilters] = useState({
    subject: [] as string[],
    format: [] as string[],
    source: [] as string[],
  });

  const handleToggle = (type, value) => {
    setSelectedFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const handleClearAll = () => {
    setSelected({ subject: [], format: [], source: [] });
  };

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
    <Container maxWidth="md" sx={{ pt: 2, pb:2  }}>
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