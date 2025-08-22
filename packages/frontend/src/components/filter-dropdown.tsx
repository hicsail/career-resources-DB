import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { SearchFiltersType } from '../types/search';
import { FormikProps, Formik } from 'formik';

interface FilterDropdownProps {
  label: string;
  name: keyof SearchFiltersType;
  options: string[];
  value: string;
  formik: FormikProps<any>;
  //setFieldValue: (field: string, value: any) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  name,
  options,
  formik
}) => {
  return (
    /*<Autocomplete
      fullWidth
      options={options}
      value={value || ''}
      onChange={(_, val) => setFieldValue(name, val || '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          name={name}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      )}
    />*/
    <Autocomplete
      fullWidth
      options={options}
      value={formik.values[name] || ''}
      onChange={(_, val) => formik.setFieldValue(name, val || '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          name={name}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          onBlur={formik.handleBlur}
          error={formik.touched[name] && Boolean(formik.errors[name])}
          helperText={formik.touched[name] && formik.errors[name]}
        />
      )}
    />
  );
};