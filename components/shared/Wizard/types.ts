import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Step, Stepper, StepperDefinition, UseStepperOptions } from '@stepperize/react';

export type WizardStep = Step<
  string,
  {
    title: ReactNode;
  }
>;

export type WizardClassNames = Partial<{
  root: string;
  list: string;
  item: string;
  trigger: string;
  indicator: string;
  title: string;
  separator: string;
  content: string;
  actions: string;
}>;

export type WizardProps<Steps extends readonly WizardStep[]> = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'onSubmit' | 'className'
> & {
  definition: StepperDefinition<Steps>;
  children: (stepper: Stepper<Steps>) => ReactNode;
  orientation?: 'horizontal' | 'vertical';
  stepperOptions?: UseStepperOptions<Steps>;
  beforeNext?: (stepper: Stepper<Steps>) => boolean | void | Promise<boolean | void>;
  beforeBack?: (stepper: Stepper<Steps>) => boolean | void | Promise<boolean | void>;
  onSubmit?: (stepper: Stepper<Steps>) => boolean | Promise<boolean>;
  backLabel?: ReactNode;
  nextLabel?: ReactNode;
  submitLabel?: ReactNode;
  submitting?: boolean;
  classNames?: WizardClassNames;
};
