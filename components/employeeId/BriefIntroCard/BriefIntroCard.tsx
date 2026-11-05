import { Card, TinyMCE } from 'components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SectionNamePdf, SectionStatePdf, SetState } from 'types';
import { RefineWithAI } from '../RefineWithAi';

const BriefIntroCard: React.FC<{
  cvModal?: SectionNamePdf;
  isSectionOpen?: SectionStatePdf;
  setIsSectionOpen?: SetState<SectionStatePdf>;
  enhanceCvWithAi?: (
    value: string,
    controller?: AbortController,
    statuses?: string[],
    index?: number,
  ) => Promise<{ cancelled: boolean }>;
  undoAiHandler?: (statuses?: string[]) => void;
}> = (props) => {
  const { getValues } = useFormContext();

  return (
    <Card
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      <TinyMCE
        inputName='brief_intro'
        placeholder='Enter brief intro'
        height={300}
        defaultValue={getValues('brief_intro')}
        extraInitConfiguration={{ resize: false }}
      />
      {props.enhanceCvWithAi && props.undoAiHandler && (
        <RefineWithAI
          isOnCard
          statuses={['brief_intro']}
          submitHandler={props.enhanceCvWithAi}
          undoHandler={props.undoAiHandler}
        />
      )}
    </Card>
  );
};

export default BriefIntroCard;
