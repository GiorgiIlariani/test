'use client';

import { Props } from './types';
import { Modal, SkillsCard, SkillsCardShowMode } from 'components';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const SkillsModal: React.FC<Props> = (props) => {
  const form = useForm({ defaultValues: props.defaultValues });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  return (
    <Modal
      title='Skills'
      open={props.isModalOpen}
      loading={props.loading}
      onOpenChange={(open) => {
        if (open === false) {
          form.reset(props.defaultValues);
          setIsFormSubmitted(false);
          props.setRemovedItems([]);
        }

        props.toggleModal();
      }}
      onConfirm={() => {
        setIsFormSubmitted(true);
        props.submitHandler(form.getValues('skills'));
      }}
      showFooter={!props.isShowMode}
    >
      <FormProvider {...form}>
        {props.isShowMode ? (
          <SkillsCardShowMode />
        ) : (
          <SkillsCard
            setRemovedItems={props.setRemovedItems}
            isFormSubmitted={isFormSubmitted}
            setIsFormSubmitted={setIsFormSubmitted}
            isShowMode={props.isShowMode}
          />
        )}
      </FormProvider>
    </Modal>
  );
};

export default SkillsModal;
