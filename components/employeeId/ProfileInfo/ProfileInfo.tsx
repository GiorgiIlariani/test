import { Props } from './types';
import { useProfileInfo } from './useProfileInfo';
import {
  EmploymentDetails,
  PersonalInfo,
  BriefIntro,
  SkillSection,
  LanguageSection,
  EducationSection,
  ExperienceSection,
  ProjectSection,
  CourseSection,
  AddToProfileModal,
  AchievementSection,
  ProfileSkeletonLoader,
} from 'components';

const ProfileInfo: React.FC<Props> = (props) => {
  const { profileSection, setProfileSections, profileSectionList, refetchEmployeeData } =
    useProfileInfo(props.employee, props.refetchEmployees);

  return (
    <>
      {props.isLoading ? (
        <ProfileSkeletonLoader />
      ) : (
        <ul className='w-full max-w-6xl relative mt-6 flex flex-col gap-6'>
          <AddToProfileModal
            addProfileInfoIsOpen={props.addProfileInfoIsOpen}
            setAddProfileInfoIsOpen={props.setAddProfileInfoIsOpen}
            profileSection={profileSection}
            setProfileSections={setProfileSections}
            userId={props.employee.id}
            setEmployee={props.setEmployee}
          />

          {profileSectionList
            .filter((item) => !item.is_hidden)
            .map((item, i) => {
              return (
                <li key={i}>
                  {item.title === 'employee information' && (
                    <EmploymentDetails
                      employee={props.employee}
                      refetchEmployeeData={refetchEmployeeData}
                    />
                  )}
                  {item.title === 'personal information' && (
                    <PersonalInfo
                      employee={props.employee}
                      refetchEmployeeData={refetchEmployeeData}
                    />
                  )}
                  {item.title === 'brief intro' && (
                    <BriefIntro employee={props.employee} refetch={refetchEmployeeData} />
                  )}
                  {item.title === 'skills' && (
                    <SkillSection
                      employee={props.employee}
                      refetchEmployeeData={refetchEmployeeData}
                    />
                  )}
                  {item.title === 'languages' && (
                    <LanguageSection
                      employee={props.employee}
                      refetchEmployeeData={refetchEmployeeData}
                    />
                  )}
                  {item.title === 'education' && (
                    <EducationSection
                      employee={props.employee}
                      refetchEmployeeData={refetchEmployeeData}
                    />
                  )}
                  {item.title === 'work experience' && (
                    <ExperienceSection
                      employee={props.employee}
                      refetchEmployeeData={refetchEmployeeData}
                    />
                  )}
                  {item.title === 'project portfolio' && (
                    <ProjectSection
                      employee={props.employee}
                      refetchEmployeeData={refetchEmployeeData}
                    />
                  )}
                  {item.title === 'courses' && (
                    <CourseSection
                      employee={props.employee}
                      refetchEmployeeData={refetchEmployeeData}
                    />
                  )}
                  {item.title === 'achievement and certifications' && (
                    <AchievementSection employee={props.employee} refetch={refetchEmployeeData} />
                  )}
                </li>
              );
            })}
        </ul>
      )}
    </>
  );
};

export default ProfileInfo;
