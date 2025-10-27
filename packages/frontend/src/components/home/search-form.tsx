import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField
} from '@mui/material';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import { FilterDropdown } from '../filter-dropdown';
import type { SearchFiltersType } from '../../types/search';

interface Props {
  onSearch: (filters: SearchFiltersType) => void;
  subjects: string[];
  sources: string[];
  formats: string[];
}

export const validationSchema = Yup.object().shape({
  phrase: Yup.string().trim().optional(),
  subjects: Yup.array().of(Yup.string()).optional(),
  formats: Yup.array().of(Yup.string()).optional(),
  sources: Yup.array().of(Yup.string()).optional(),
});

export const initialValues: SearchFiltersType = {
  phrase: '',
  subjects: [],
  formats: [],    
  sources: [],    
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
          {(formik: FormikProps<SearchFiltersType>) => (
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
                  error={formik.touched.phrase && Boolean(formik.errors.phrase)}
                  helperText={formik.touched.phrase && formik.errors.phrase}
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
                  name="subjects"
                  options={subjects}
                  formik={formik}
                  multiple={true}
                />
                <FilterDropdown
                  label="Format (optional)"
                  name="formats"
                  options={formats}
                  formik={formik}
                  multiple={true}
                />
                <FilterDropdown
                  label="Source (optional)"
                  name="sources"
                  options={sources}
                  formik={formik}
                  multiple={true}
                />                
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};