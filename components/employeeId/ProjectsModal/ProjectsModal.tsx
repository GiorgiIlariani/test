import { ProjectCard, Modal } from 'components';
import { Props } from './types';
import { FormProvider } from 'react-hook-form';
import { useProjectModal } from './useProjectModal';

const ProjectsModal: React.FC<Props> = (props) => {
  const { form, enhanceUserWithAi, undoAiHandler } = useProjectModal(
    props.defaultValues,
    props.employee,
    props.setIsLoading,
  );

  return (
    <Modal
      title='Project Portfolio'
      open={props.isModalOpen}
      onOpenChange={(open) => {
        if (open === false) {
          form.reset(form.formState.defaultValues);
          props.setRemovedItems([]);
        }

        props.toggleModal();
      }}
      onConfirm={() => props.submitHandler(form.getValues('projects'), form)}
      loading={props.loading}
    >
      <FormProvider {...form}>
        <ProjectCard
          setRemovedItems={props.setRemovedItems}
          enhanceCvWithAi={enhanceUserWithAi}
          undoAiHandler={undoAiHandler}
        />
      </FormProvider>
    </Modal>
  );
};

export default ProjectsModal;
