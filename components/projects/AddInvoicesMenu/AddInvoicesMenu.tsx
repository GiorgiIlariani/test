import { Plus } from 'components/icons';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components';
import { InvoiceTypes } from 'types';
import { analytics } from 'helpers';

const AddInvoicesMenu: React.FC<{ setInvoicesIsOpen: (i: InvoiceTypes | undefined) => void }> = (
  props,
) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='grid place-content-center size-6 rounded-full text-background bg-primary hover:bg-primary-hover transition'>
        <Plus />
      </DropdownMenuTrigger>

      <DropdownMenuContent align='center' className='w-auto'>
        <DropdownMenuItem
          onClick={() => {
            props.setInvoicesIsOpen('invoice');
            analytics.track('Project - Create Invoice');
          }}
        >
          Create Invoice
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            props.setInvoicesIsOpen('contract asset');
            analytics.track('Project - Create Contract Asset');
          }}
        >
          Create Contract Asset
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            props.setInvoicesIsOpen('revenue');
            analytics.track('Project - Create Revenue');
          }}
        >
          Create Revenue
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            props.setInvoicesIsOpen('proforma');
            analytics.track('Project - Create Proforma Invoice');
          }}
        >
          Create Proforma Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddInvoicesMenu;
