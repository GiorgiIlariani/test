import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from 'components';
import React from 'react';
import { Props } from './types';
import { useActiveArchiveSelect } from './useActiveArchiveSelect';
import { ChevronDownIcon } from 'lucide-react';

const ActiveArchiveSelect: React.FC<Props> = (props) => {
  const { getDropdownText, handleActiveArchiveChange, onlyActiveSelected, onlyInactiveSelected } =
    useActiveArchiveSelect(
      props.setActiveArchive,
      props.activeArchive,
      props.dispatchEmployeeInfo,
      props.setArchiveActiveIsLoading,
      props.archiveActiveIsLoading,
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant='outline' className='capitalize'>
            {getDropdownText()}
            <ChevronDownIcon className='transition-transform group-data-popup-open/button:rotate-180' />
          </Button>
        }
      />

      <DropdownMenuContent className='w-36'>
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={props.activeArchive.includes('active')}
            disabled={onlyActiveSelected}
            closeOnClick={false}
            onCheckedChange={(checked) => handleActiveArchiveChange('active', checked)}
          >
            Active
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={props.activeArchive.includes('inactive')}
            disabled={onlyInactiveSelected}
            closeOnClick={false}
            onCheckedChange={(checked) => handleActiveArchiveChange('inactive', checked)}
          >
            Inactive
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActiveArchiveSelect;
