import { defineStepper, type Stepper } from '@stepperize/react';

export const clientFlow = defineStepper(
  [
    { id: 'details', title: 'Details' },
    { id: 'contactInformation', title: 'Contact Information' },
  ],
  { linear: true },
);

export type ClientWizardStepper = Stepper<typeof clientFlow.steps>;
