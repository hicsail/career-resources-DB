import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Autocomplete,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FilterDropdown } from './filter-dropdown';
import type { SearchFiltersType } from '../types/search';

interface Props {
  onSearch: (filters: SearchFiltersType) => void;
  subjects: string[];
  sources: string[];
  formats: string[];
}

export const validationSchema = Yup.object().shape({
  phrase: Yup.string().trim().required('Please enter a search phrase'),
  subject: Yup.string().optional(),
  format: Yup.string().optional(),
  source: Yup.string().optional(),
});

export const initialValues: SearchFiltersType = {
  phrase: '',
  subject: '',
  format: '',
  source: '',
};

export const SearchForm: React.FC<Props> = ({
  onSearch,
  subjects,
  formats,
  sources,
}) => {
  const handleSubmit = (values: SearchFiltersType) => {
    onSearch(values);
  };

  return (
    <Card sx={{ maxWidth: '1000px', width: '95%', mx: 'auto', mt: 4, p: 3 }}>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              {/* Row 1: Search bar + button */}
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={3}
                alignItems="center"
                mb={3}
              >
                <Field
                  as={TextField}
                  fullWidth
                  name="phrase"
                  label="Search for a document"
                  variant="outlined"
                  error={touched.phrase && Boolean(errors.phrase)}
                  helperText={touched.phrase && errors.phrase}
                />
                <Button type="submit" variant="contained" color="primary">
                  Search
                </Button>
              </Box>

              {/* Row 2: Dropdown filters */}
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={3}
              >                
                <FilterDropdown
                  label="Subject (optional)"
                  name="subject"
                  options={subjects}
                  value={values.subject || ''}
                  setFieldValue={setFieldValue}
                />
                <FilterDropdown
                  label="Format (optional)"
                  name="format"
                  options={formats}
                  value={values.format || ''}
                  setFieldValue={setFieldValue}
                />
                <FilterDropdown
                  label="Source (optional)"
                  name="source"
                  options={sources}
                  value={values.source || ''}
                  setFieldValue={setFieldValue}
                />                
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};