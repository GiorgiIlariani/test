import { FormProvider, useForm } from 'react-hook-form';
import { Props } from './types';
import { LanguageCard, Modal } from 'components';
import { useLanguageAndLevel } from 'hooks';

const LanguagesModal: React.FC<Props> = (props) => {
  const form = useForm({
    defaultValues: props.defaultValues,
    mode: 'onChange',
  });
  const { languages, levels } = useLanguageAndLevel();

  return (
    <Modal
      title='Languages'
      open={props.isModalOpen}
      onOpenChange={(open) => {
        if (open === false) {
          form.reset(props.defaultValues);
          props.setRemovedItems([]);
        }

        props.toggleModal();
      }}
      onConfirm={() => props.submitHandler(form.getValues('languages'), form)}
      loading={props.loading}
    >
      <FormProvider {...form}>
        <LanguageCard
          setRemovedItems={props.setRemovedItems}
          employeeId={props.employeeId}
          languages={languages}
          levels={levels}
        />
      </FormProvider>
    </Modal>
  );
};

export default LanguagesModal;
