import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ShadcnCard,
  ShadcnCardContent,
} from 'components';
import { Props } from './types';
import { useProfileInfoSectionWrapper } from './useProfileInfoSectionWrapper';
import { ArrowDownUpIcon, ChevronDownIcon, PencilIcon } from 'lucide-react';

const ProfileInfoSectionWrapper: React.FC<Props> = (props) => {
  const { canEdit, isOpen, setIsOpen, canReorder } = useProfileInfoSectionWrapper(
    props.employeeId,
    props.isEmpty!,
    props.canNotEdit,
  );

  return (
    <ShadcnCard className='hover:bg-secondary transition-colors group/card'>
      <ShadcnCardContent>
        {props.isEmpty ? (
          <>
            <div className='pl-3 pr-2 min-h-8 w-full flex items-center justify-between text-base font-bold'>
              {props.sectionName}

              {canEdit() && (
                <Button
                  type='button'
                  size='lg'
                  variant='default-outline'
                  onClick={() => props.toggleModal?.()}
                >
                  Add information
                </Button>
              )}
            </div>

            {/* Render children so Modals are mounted and can be opened */}
            <div className='hidden'>{props.children}</div>
          </>
        ) : (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger
              render={
                <div className='group cursor-pointer pl-3 pr-2 min-h-8 w-full flex items-center justify-between text-base font-bold'>
                  {props.sectionName}

                  <div className='flex items-center gap-3'>
                    {isOpen && (
                      <>
                        {props.reorder && canReorder() && (
                          <Button
                            variant='tertiary'
                            className='opacity-0 invisible group-hover/card:visible group-hover/card:opacity-100 transition-all'
                            onClick={(e) => {
                              e.stopPropagation();
                              props.toggleReorderModal?.();
                            }}
                          >
                            Reorder <ArrowDownUpIcon />
                          </Button>
                        )}

                        {canEdit() && (
                          <Button
                            variant='tertiary'
                            className='opacity-0 invisible group-hover/card:visible group-hover/card:opacity-100 transition-all'
                            onClick={(e) => {
                              e.stopPropagation();
                              props.toggleModal?.();
                            }}
                          >
                            Edit <PencilIcon />
                          </Button>
                        )}
                      </>
                    )}

                    <ChevronDownIcon className='group-data-panel-open:rotate-180 transition-transform' />
                  </div>
                </div>
              }
            />

            <CollapsibleContent className='pt-4'>{props.children}</CollapsibleContent>
          </Collapsible>
        )}
      </ShadcnCardContent>
    </ShadcnCard>
  );
};

export default ProfileInfoSectionWrapper;
