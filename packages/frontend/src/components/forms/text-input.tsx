import { FC } from 'react';
import { FormControl, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { useField, useFormikContext } from 'formik';

export type TextInputProps = TextFieldProps & {
  name: string;
};

export const TextInput: FC<TextInputProps> = (props) => {
  const [field, meta] = useField(props.name);
  const { isSubmitting } = useFormikContext();
  return (
    <FormControl fullWidth={props.fullWidth}>
      <TextField
        InputLabelProps={{ shrink: true }}
        fullWidth
        variant="outlined"
        margin={'normal'}
        {...props}
        {...field}
        autoComplete={props.autoComplete}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        disabled={isSubmitting || props.disabled}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
      />
    </FormControl>
  );
};