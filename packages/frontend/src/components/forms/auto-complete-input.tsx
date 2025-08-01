import { FC } from 'react';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import type { AutocompleteProps } from '@mui/material/Autocomplete';
import { useField, useFormikContext } from 'formik';

export interface AutoCompleteOption {
  id: string;
  label: string;
}

export interface AutoCompleteInputProps extends Omit<AutocompleteProps<any, any, any, any>, 'renderInput' | 'options'> {
  name: string;
  label?: string;
  options: AutoCompleteOption[];
  textFieldProps?: Omit<TextFieldProps, 'error' | 'helperText'>;
}

export const AutoCompleteInput: FC<AutoCompleteInputProps> = ({ name, label, options, textFieldProps, ...autocompleteProps }) => {
  const { setFieldValue } = useFormikContext();
  const [_field, meta] = useField(name);

  return (
    <Autocomplete
      disableClearable
      disablePortal
      {...autocompleteProps}
      options={options}
      getOptionLabel={(option) => option.label}
      onChange={(_, value) => setFieldValue(name, value?.id)}
      renderInput={(params) => (
        <TextField 
          {...params} 
          {...textFieldProps} 
          disabled={true} 
          label={label} 
          error={meta.touched && Boolean(meta.error)} 
          helperText={meta.touched && meta.error} 
        />
      )}
    />
  );
};