import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { SearchFiltersType } from '../types/search';
import type { FormikProps } from 'formik'; // remove unused Formik import

interface FilterDropdownProps {
  label: string;
  name: keyof SearchFiltersType;
  options: string[];
  formik: FormikProps<any>;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  name,
  options,
  formik
}) => {
  // Ensure helperText is a string
  const errorText = formik.touched[name] && formik.errors[name];
  const helperText = typeof errorText === 'string' ? errorText : '';

  return (
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
          error={Boolean(helperText)}
          helperText={helperText}
        />
      )}
    />
  );
};