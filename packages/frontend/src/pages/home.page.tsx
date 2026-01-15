// ✨ CHANGED: added more MUI components for layout + collapsible UI
import { FC, useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,        
  Button,       
  Collapse,     
  Divider,      
  Link,         
  Stack,        
} from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; 

import { SearchForm } from '../components/home/search-form';
import { ResultsList } from '../components/home/result-list';
import { GettingStartedCollapse } from '../components/home/intro-collapsible';
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
  const [_, setError] = useState<string | null>(null);
  const { searchResources, getAllDocumentMetadata } = useApiServices();

  const handleSearch = async (filters: SearchFiltersType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchResources({
        ...filters,
        startYear: filters.startYear ?? undefined,
        endYear: filters.endYear ?? undefined,
      });
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDocumentMetadata();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch document metadata.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 3, pb: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Future Readiness Resources Database
      </Typography>

      {/* Introduction */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          Welcome to the Future Readiness Resources database! The documents here range from
          toolkits, Perkins V documents, research publications, book chapters, lesson plans and
          more. We hope that you will find helpful resources here whether you are a parent,
          caregiver, counselor, teacher or researcher.
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          We want to thank our national and international colleagues, the State Leader’s Career
          Development Network and our research partners for their resource contributions to this
          database; this would not have been possible without them.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* collapsible */}
        <GettingStartedCollapse />
    
      </Paper>

      {/* (unchanged) search form */}
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
          <SearchOffIcon sx={{ fontSize: 60, color: 'grey.500' }} />
          <Typography mt={2} color="text.secondary">
            No results found.
          </Typography>
        </Box>
      )}
    </Container>
  );
};