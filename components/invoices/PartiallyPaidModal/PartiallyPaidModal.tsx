import { Field, FieldLabel, InputGroup, InputGroupAddon, InputGroupInput, Modal } from 'components';
import { allowOnlyNumbersInInputWithDot, formatCurrencyInput } from 'helpers';
import React from 'react';
import { Props } from './types';
import { DollarSignIcon, EuroIcon, GeorgianLariIcon, PoundSterlingIcon } from 'lucide-react';

const currencyIconMap: Record<string, React.ComponentType<any>> = {
  USD: DollarSignIcon,
  EUR: EuroIcon,
  GBP: PoundSterlingIcon,
  GEL: GeorgianLariIcon,
};

const PartiallyPaidModal: React.FC<Props> = (props) => {
  const CurrencyIcon = currencyIconMap[props.currency] ?? DollarSignIcon;

  return (
    <Modal
      open
      onOpenChange={(open) => !open && props.onClose()}
      title='Partially Paid'
      closeButtonText='Cancel'
      confirmButtonText='Submit'
      contentClassName='max-w-100'
      onConfirm={props.onConfirm}
    >
      <Field>
        <FieldLabel htmlFor='paid_amount'>Paid Amount</FieldLabel>

        <InputGroup>
          <InputGroupAddon>
            <CurrencyIcon />
          </InputGroupAddon>

          <InputGroupInput
            id='paid_amount'
            placeholder='0'
            value={props.inputValue}
            onKeyDown={(e) => allowOnlyNumbersInInputWithDot(e)}
            onChange={(e) => props.setInputValue(formatCurrencyInput(e))}
            autoFocus
          />
        </InputGroup>
      </Field>
    </Modal>
  );
};

export default PartiallyPaidModal;
