import React, { useEffect } from 'react'; 
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
  states: string[];
  countries: stringp[];
}

export const validationSchema = Yup.object().shape({
  phrase: Yup.string().trim().optional(),
  subjects: Yup.array().of(Yup.string()).optional(),
  formats: Yup.array().of(Yup.string()).optional(),
  sources: Yup.array().of(Yup.string()).optional(),
  startYear: Yup.number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .nullable()
    .optional(),
  endYear: Yup.number()
    .min(Yup.ref('startYear'), 'End year cannot be before start year')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .nullable()
    .optional(),
  state: Yup.string().optional(),
  country: Yup.string().optional()
});

export const initialValues: SearchFiltersType = {
  phrase: '',
  subjects: [],
  formats: [],
  sources: [],
  startYear: null,
  endYear: null,
  state: '',
  country: ''
};

export const SearchForm: React.FC<Props> = ({
  onSearch,
  subjects,
  formats,
  sources,
  states,
  countries
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
          {(formik: FormikProps<SearchFiltersType>) => {
            // derive International flag directly from Formik
            const isInternational = formik.values.state === 'International';

            // automatically clear country when not international
            useEffect(() => {
              if (!isInternational && formik.values.country) {
                formik.setFieldValue('country', '');
              }
            }, [isInternational, formik]);

            return (
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
                  mb={3}
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

                {/* Row 3: Location filters */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  gap={3}
                  mb={3}
                >
                  <FilterDropdown
                    label="State or International"
                    name="state"
                    options={[...states, 'International']} // ensure "International" exists
                    formik={formik}
                    multiple={false}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                      const selected = event.target.value as string;
                      formik.setFieldValue('state', selected);
                    }}
                  />

                  {/* Show only if International selected */}
                  {isInternational && (
                    <FilterDropdown
                      label="Country"
                      name="country"
                      options={countries}
                      formik={formik}
                      multiple={false}
                    />
                  )}
                </Box>

                {/* Row 4: Year range fields */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  gap={3}
                >
                  <Field
                    as={TextField}
                    fullWidth
                    type="number"
                    name="startYear"
                    label="From Year"
                    inputProps={{
                      min: 1900,
                      max: new Date().getFullYear(),
                      step: 1
                    }}
                    variant="outlined"
                    error={
                      formik.touched.startYear &&
                      Boolean(formik.errors.startYear)
                    }
                    helperText={
                      formik.touched.startYear && formik.errors.startYear
                    }
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    type="number"
                    name="endYear"
                    label="To Year"
                    inputProps={{
                      min: 1900,
                      max: new Date().getFullYear(),
                      step: 1
                    }}
                    variant="outlined"
                    error={
                      formik.touched.endYear && Boolean(formik.errors.endYear)
                    }
                    helperText={formik.touched.endYear && formik.errors.endYear}
                  />
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
};