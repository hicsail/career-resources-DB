import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { FormikProps } from 'formik';

interface FilterDropdownProps {
  label: string;
  name: string;
  options: string[];
  formik: FormikProps<any>;
  multiple?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  name,
  options,
  formik,
  multiple = false,
}) => {
  // Normalize value based on single vs multi select
  const value = multiple
    ? ((formik.values[name] as unknown as string[]) || [])
    : ((formik.values[name] as unknown as string) || '');

  // Ensure helperText is a string
  const err = formik.touched[name] && formik.errors[name];
  const helperText = typeof err === 'string' ? err : '';

  return (
    <Autocomplete
      fullWidth
      options={options}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      filterSelectedOptions={multiple}
      value={value as any}
      onChange={(_, val) =>
        formik.setFieldValue(name, multiple ? (val as string[]) : (val || ''))
      }
      getOptionLabel={(opt) => (typeof opt === 'string' ? opt : String(opt))}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          name={name as string}
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