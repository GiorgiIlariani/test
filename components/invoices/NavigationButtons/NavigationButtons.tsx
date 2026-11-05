import React from 'react';
import { Props } from './types';
import { can } from 'helpers';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from 'components';
import { DownloadIcon, TrashIcon } from 'lucide-react';

const NavigationButtons: React.FC<Props> = (props) => {
  return (
    <>
      <DropdownMenu disabled={!props.disableApprove}>
        <DropdownMenuTrigger
          render={
            <Button type='button' variant='outline'>
              <DownloadIcon /> Export as PDF
            </Button>
          }
        />

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => props.generateInvoice(true, 'en')}>
              Export English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => props.generateInvoice(true, 'ka')}>
              Export Georgian
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {props.reviewButtonHandler().includes('canReview') &&
        can('project-invoice::review', props.permissions) && (
          <>
            <Separator orientation='vertical' />

            <Button
              type='button'
              variant='outline'
              disabled={!props.reviewButtonHandler().includes('reviewIsActive')}
              onClick={props.openReviewModal}
            >
              Review
            </Button>
          </>
        )}

      {can('project-invoice::delete', props.permissions) && (
        <>
          <Separator orientation='vertical' />

          <Button
            type='button'
            variant='destructive'
            disabled={!props.reviewButtonHandler().includes('reviewIsActive')}
            onClick={() => props.setDeleteDialog(true)}
          >
            <TrashIcon />
            Delete
          </Button>
        </>
      )}
    </>
  );
};

export default NavigationButtons;
