import { Props } from './types';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { EducationCard, Modal } from 'components';
import { useEducationModal } from './useEducationModal';

const EducationModal: React.FC<Props> = (props) => {
  const { form, enhanceUserWithAi, undoAiHandler } = useEducationModal(
    props.defaultValues,
    props.employee,
    props.setIsLoading,
  );

  return (
    <Modal
      title='Education'
      open={props.isModalOpen}
      onOpenChange={(open) => {
        if (open === false) {
          form.reset(form.formState.defaultValues);
          props.setRemovedItems([]);
        }

        props.toggleModal();
      }}
      onConfirm={() => props.submitHandler(form.getValues('education'), form)}
      loading={props.loading}
    >
      <FormProvider {...form}>
        <EducationCard
          setRemovedItems={props.setRemovedItems}
          enhanceCvWithAi={enhanceUserWithAi}
          undoAiHandler={undoAiHandler}
        />
      </FormProvider>
    </Modal>
  );
};

export default EducationModal;
