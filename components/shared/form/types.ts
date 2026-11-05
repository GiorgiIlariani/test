import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

type ChildRenderParams<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
};

export type FormBaseProps = {
  name: string;
  children: (params: ChildRenderParams) => React.ReactNode;
  id?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  info?: string;
  required?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  orientation?: 'vertical' | 'horizontal' | 'responsive' | null;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
};

export type BaseFormProps = Omit<FormBaseProps, 'children'>;

export type Option = {
  value: string | number;
  label: string;
};

export type GroupedOption = {
  label: string;
  items: Option[];
};
