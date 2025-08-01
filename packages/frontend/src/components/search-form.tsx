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

interface Props {
  onSearch: (filters: { keyword: string; tag?: string }) => void; 
  tags: string[]; 
}

export const validationSchema = Yup.object().shape({
  keyword: Yup.string().trim().required('Please enter a search keyword'),
  tag: Yup.string().optional(), 
});

export const initialValues = { keyword: '', tag: '' }; 

export const SearchForm: React.FC<Props> = ({ onSearch, tags }) => {
  const handleSubmit = (values: { keyword: string; tag?: string }) => {
    onSearch(values); 
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={2}
                alignItems="center"
              >
                <Field
                  as={TextField}
                  fullWidth
                  name="keyword"
                  label="Search for a document"
                  variant="outlined"
                  error={touched.keyword && Boolean(errors.keyword)}
                  helperText={touched.keyword && errors.keyword}
                />

                <Autocomplete
                  fullWidth
                  options={tags}
                  value={values.tag || ''}
                  onChange={(_, value) => setFieldValue('tag', value || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tag (optional)"
                      name="category"
                      variant="outlined"
                    />
                  )}
                />

                <Button type="submit" variant="contained" color="primary">
                  Search
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};