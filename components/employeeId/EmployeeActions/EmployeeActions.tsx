import {
  CarerChange,
  TerminateModal,
  RehireModal,
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from 'components';
import React from 'react';
import { useEmployeeActions } from './useEmployeeActions';
import { Props } from './types';
import { PreventTerminationModal } from '../PreventTerminationModal';
import { ChevronDownIcon } from 'lucide-react';

const EmployeeActions: React.FC<Props> = (props) => {
  const {
    carerChangeIsOpen,
    togglerCarerChange,
    terminating,
    togglerTerminating,
    canNotTerminate,
    setCanNotTerminate,
    userProjectsInfo,
    setUserProjectsInfo,
    latestCareerEventType,
    toggleRehire,
    rehire,
  } = useEmployeeActions(props.careerLog);

  return (
    <div className='relative w-fit'>
      {carerChangeIsOpen && (
        <CarerChange
          toggleModal={togglerCarerChange}
          userId={props.userId}
          employee={props.employee}
          setActionsAreAdded={props.setActionsAreAdded}
          refetchEmployees={props.refetchEmployees}
          careerLog={props.careerLog}
          joinDate={props.careerLog.find((log) => log.type === 'Started working')?.date}
        />
      )}
      {terminating && (
        <>
          {canNotTerminate && (
            <PreventTerminationModal
              closeModal={() => setCanNotTerminate(false)}
              userProjectsInfo={userProjectsInfo}
            />
          )}

          <TerminateModal
            userId={props.userId}
            toggleModal={togglerTerminating}
            setActionsAreAdded={props.setActionsAreAdded}
            joinDate={props.careerLog.find((log) => log.type === 'Started working')!.date}
            setCanNotTerminate={setCanNotTerminate}
            setUserProjectsInfo={setUserProjectsInfo}
            refetchEmployees={props.refetchEmployees}
          />
        </>
      )}
      {rehire && (
        <RehireModal
          userId={props.userId}
          toggleModal={toggleRehire}
          setActionsAreAdded={props.setActionsAreAdded}
          joinDate={props.careerLog.find((log) => log.type === 'Started working')!.date}
          refetchEmployees={props.refetchEmployees}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size='lg' variant='outline' className='group'>
              Action
              <ChevronDownIcon className='group-data-popup-open:rotate-180 transition-transform' />
            </Button>
          }
        />

        <DropdownMenuContent align='end'>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={togglerCarerChange}>Career changes</DropdownMenuItem>
            <DropdownMenuItem
              onClick={latestCareerEventType === 'Termination' ? toggleRehire : togglerTerminating}
            >
              {latestCareerEventType === 'Termination' ? 'Rehire' : 'Terminations'}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EmployeeActions;
