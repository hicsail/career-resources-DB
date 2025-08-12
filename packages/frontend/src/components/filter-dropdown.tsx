import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { SearchFiltersType } from '../types/search';

interface FilterDropdownProps {
  label: string;
  name: keyof SearchFiltersType;
  options: string[];
  value: string;
  setFieldValue: (field: string, value: any) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  name,
  options,
  value,
  setFieldValue,
}) => {
  return (
    <Autocomplete
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
    />
  );
};