import { CompanyCard, Modal } from 'components';
import { Props } from './types';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useExpirienceModal } from './useExpirienceModal';

const ExperienceModal: React.FC<Props> = (props) => {
  const { form, enhanceUserWithAi, undoAiHandler } = useExpirienceModal(
    props.defaultValues,
    props.employee,
    props.setIsLoading,
  );

  return (
    <Modal
      title='Experience'
      open={props.isModalOpen}
      onOpenChange={(open) => {
        if (open === false) {
          form.reset(form.formState.defaultValues);
          props.setRemovedItems([]);
        }

        props.toggleModal();
      }}
      onConfirm={() => props.submitHandler(form.getValues('experiences'), form)}
      loading={props.loading}
    >
      <FormProvider {...form}>
        <CompanyCard
          setRemovedItems={props.setRemovedItems}
          enhanceCvWithAi={enhanceUserWithAi}
          undoAiHandler={undoAiHandler}
        />
      </FormProvider>
    </Modal>
  );
};

export default ExperienceModal;
