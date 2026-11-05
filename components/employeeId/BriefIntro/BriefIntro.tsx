import { Props } from './types';
import React from 'react';
import { useBriefIntro } from './useBriefIntro';
import {
  ProfileInfoSectionWrapper,
  BriefIntroModal,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'components';
import { CircleCheckIcon, CopyIcon } from 'lucide-react';

const BriefIntro: React.FC<Props> = (props) => {
  const sectionName = 'Brief intro';

  const {
    __html,
    isModalOpen,
    toggleModal,
    form,
    value,
    setValue,
    itemIsCopied,
    setItemIsCopied,
    contentRef,
    copyFormattedText,
  } = useBriefIntro(props.employee, sectionName);

  return (
    <ProfileInfoSectionWrapper
      sectionName={sectionName}
      isEmpty={!props.employee.brief_intro && !value}
      toggleModal={toggleModal}
      employeeId={props.employee.id}
    >
      <div
        className='px-3 flex items-start group'
        onMouseLeave={() => {
          setItemIsCopied(false);
        }}
      >
        <Tooltip open={itemIsCopied ? true : undefined}>
          <TooltipTrigger
            render={
              <button
                onClick={() => copyFormattedText()}
                className='mt-0.5 w-0 invisible opacity-0 group-hover:w-6 group-hover:visible group-hover:opacity-100 group-hover:mr-2 transition-all'
              >
                {itemIsCopied ? (
                  <CircleCheckIcon size={16} className='text-success' />
                ) : (
                  <CopyIcon size={16} className='text-muted-foreground' />
                )}
              </button>
            }
          />
          {itemIsCopied && <TooltipContent side='left'>Copied</TooltipContent>}
        </Tooltip>

        <div
          className='mce flex flex-col gap-4 text-sm text-zinc-700 [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
          dangerouslySetInnerHTML={{ __html }}
          ref={contentRef}
        />
      </div>

      <BriefIntroModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        form={form}
        employee={props.employee}
        setValue={setValue}
        refetch={props.refetch}
      />
    </ProfileInfoSectionWrapper>
  );
};

export default BriefIntro;
