import { BriefIntroCard, Modal } from 'components';
import { Props } from './types';
import { useBriefIntroModal } from './useBriefIntroModal';
import { FormProvider } from 'react-hook-form';

const BriefIntroModal: React.FC<Props> = (props) => {
  const { isLoading, handleSubmit, enhanceUserWithAi, undoAiHandler } = useBriefIntroModal(
    props.employee,
    props.toggleModal,
    props.setValue,
    props.refetch,
    props.form,
  );

  return (
    <Modal
      title='Brief Intro'
      open={props.isModalOpen}
      onOpenChange={props.toggleModal}
      onConfirm={props.form.handleSubmit(handleSubmit)}
      loading={isLoading}
    >
      <FormProvider {...props.form}>
        <BriefIntroCard enhanceCvWithAi={enhanceUserWithAi} undoAiHandler={undoAiHandler} />
      </FormProvider>
    </Modal>
  );
};

export default BriefIntroModal;
