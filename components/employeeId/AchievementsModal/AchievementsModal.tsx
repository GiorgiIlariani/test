import { AchievementsCard, Modal } from 'components';
import { useAchievementsModal } from './useAchievementsModal';
import { Props } from './types';
import { FormProvider } from 'react-hook-form';

const AchievementsModal: React.FC<Props> = (props) => {
  const { isLoading, handleSubmit, setIds, fileErrors, setFileErrors } = useAchievementsModal(
    props.employee,
    props.toggleModal,
    props.setValue,
    props.form,
    props.refetch,
  );

  return (
    <Modal
      title='Achievements and Certifications'
      open={props.isModalOpen}
      onOpenChange={(open) => {
        if (open === false) {
          props.form.reset();
        }

        props.toggleModal();
      }}
      onConfirm={props.form.handleSubmit(handleSubmit)}
      loading={isLoading}
    >
      <FormProvider {...props.form}>
        <AchievementsCard setIds={setIds} fileErrors={fileErrors} setFileErrors={setFileErrors} />
      </FormProvider>
    </Modal>
  );
};

export default AchievementsModal;
