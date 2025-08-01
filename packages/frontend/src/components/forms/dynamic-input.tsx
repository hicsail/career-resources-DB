import { FC } from 'react';
import { TextInput } from './text-input';
import { AutoCompleteInput } from './auto-complete-input';

export type InputType = 'Text' | 'DropDown';

export type DynamicFormInputProps = {
  type: InputType;
  name: string;
  label?: string;
  options?: AutoCompleteOption[];
};

export const DynamicFormInput: FC<DynamicFormInputProps> = ({ type, ...props }) => {
  switch (type) {
    case 'Text':
      return <TextInput name={props.name} label={props.label} />;    
    case 'DropDown':
      return <AutoCompleteInput name={props.name} label={props.label} options={props.options || []} />;
    default:
      return null;
  }
};