import { Props } from './types';
import { useSkillSection } from './useSkillSection';
import { SkillsList, ProfileInfoSectionWrapper, SkillsModal } from 'components';
import { FormProvider } from 'react-hook-form';

const SkillSection: React.FC<Props> = (props) => {
  const sectionName = 'Skills';

  const { employeeData, form, submitHandler, toggleModal, setRemovedItems, isModalOpen, loading } =
    useSkillSection(props.employee, props.refetchEmployeeData, sectionName);

  return (
    <ProfileInfoSectionWrapper
      sectionName={sectionName}
      isEmpty={!employeeData.skills?.length}
      toggleModal={toggleModal}
      employeeId={props.employee.id}
    >
      <SkillsModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        submitHandler={submitHandler}
        setRemovedItems={setRemovedItems}
        defaultValues={form.getValues()}
        loading={loading}
      />

      <FormProvider {...form}>
        <div className='px-2'>
          <ul className={`flex gap-4 flex-wrap`}>
            {employeeData.skills?.map((skill) => (
              <SkillsList skill={skill} displayDuration={true} key={skill.id} />
            ))}
          </ul>
        </div>
      </FormProvider>
    </ProfileInfoSectionWrapper>
  );
};

export default SkillSection;
