import {
  Backdrop,
  NormalInput,
  EducationCard,
  WhiteLabelRedberryToggle,
  PortalWrapper,
  X,
  CvEditDropdown,
  CompanyCard,
  ProjectCard,
  AchievementsCard,
  CourseCard,
  LanguageCard,
  SkillsCard,
  BriefIntroCard,
  PersonalInformation,
  PdfPreview,
  Loader,
  Card,
} from 'components';
import { FormProvider } from 'react-hook-form';
import { Props } from './types';
import { useCvEditModal } from './useCvEditModal';
import { EditCvModalFormDataType } from 'types';
import { analytics } from 'helpers';
import { RefineWithAI } from '../RefineWithAi';

const CvEditModal: React.FC<Props> = (props) => {
  const {
    namingTabIsOpen,
    checkRDBR,
    checkWhiteLabel,
    whiteLabelChecked,
    redberryToggler,
    form,
    sections,
    tab,
    isFormSubmitted,
    setIsFormSubmitted,
    changeCvModalTab,
    cvData,
    setCvData,
    handleSubmitForm,
    skillsRef,
    cvIsUpdated,
    setCvIUpdated,
    isLoading,
    updatePreview,
    languages,
    levels,
    setSkillsAreReordered,
    isSectionOpen,
    setIsSectionOpen,
    enhanceCvWithAi,
    undoAiHandler,
  } = useCvEditModal(
    props.employee,
    props.defaultValues as EditCvModalFormDataType,
    props.modalToggler,
    props.reRendedCvHistory,
    props.canOverWriteCv,
    props.cvId,
    props.cvVariant,
  );

  return (
    <FormProvider {...form}>
      <PortalWrapper>
        <div
          className='z-50 absolute inset-0 my-6 mx-6 flex items-center justify-center'
          aria-labelledby='modal-title'
          role='dialog'
          aria-modal='true'
        >
          <Backdrop onClick={props.modalToggler} />
          <div
            className={`${tab === 'preview' ? 'bg-[#F3F4F6]' : 'bg-white'} ${
              tab === 'both' ? 'overflow-clip' : 'overflow-y-scroll'
            }  relative flex flex-col left-12 z-60 w-[94%] h-full rounded-lg`}
          >
            <div className='flex items-center justify-between border-b px-6 bg-white! py-4 rounded-lg'>
              <h1 className='text-start font-bold text-slate-900 '>CV export</h1>
              <button
                onClick={props.modalToggler}
                type='button'
                className='z-50 p-1 hover:bg-gray-300 rounded-full'
              >
                <X className='cursor-pointer' />
              </button>
            </div>

            <nav
              className={`${
                tab === 'preview'
                  ? 'bg-[#F3F4F6] w-[595px] mx-auto  flex items-center justify-start py-6'
                  : 'flex items-center justify-between mx-auto py-6'
              }`}
            >
              {tab === 'preview' && (
                <h3 className='text-[#5A636F] w-1/3 text-left'>Document Preview</h3>
              )}

              <div
                className={`${
                  tab === 'preview' ? 'w-[45%] bg-white rounded-[110px] py-1' : ''
                } flex items-center gap-3 justify-center`}
              >
                <button
                  type='button'
                  className={`${
                    tab === 'sections'
                      ? 'bg-[#4F46E5]/8 rounded-[36px] align-center text-indigo-600 font-medium'
                      : 'border-transparent text-slate-900 hover:bg-[#e6e7e9] rounded-[36px]'
                  } cursor-pointer whitespace-nowrap py-2 px-4 text-sm  hover:border-gray-300`}
                  onClick={() => {
                    changeCvModalTab('sections');
                    analytics.track('PDF Modal - Switched into Sections');
                  }}
                >
                  Sections
                </button>

                <button
                  type='button'
                  className={` ${
                    tab === 'both'
                      ? 'bg-[#4F46E5]/8 rounded-[36px] align-center text-indigo-600 font-medium'
                      : 'border-transparent text-slate-900 hover:bg-[#e6e7e9] rounded-[36px]'
                  }  transparent cursor-pointer whitespace-nowrap py-2 px-4 text-sm hover:border-gray-300 `}
                  onClick={() => {
                    changeCvModalTab('both');
                    analytics.track('PDF Modal - Switched into Both');
                  }}
                >
                  Both
                </button>

                <button
                  type='button'
                  className={` ${
                    tab === 'preview'
                      ? 'bg-[#4F46E5]/8 rounded-[36px] align-center text-indigo-600 font-medium'
                      : 'border-transparent text-slate-900 hover:bg-[#e6e7e9] rounded-[36px]'
                  }  transparent cursor-pointer whitespace-nowrap py-2  px-4 text-sm hover:border-gray-300`}
                  onClick={() => {
                    changeCvModalTab('preview');
                    analytics.track('PDF Modal - Switched into Preview');
                  }}
                >
                  Preview
                </button>
              </div>

              {tab === 'preview' && (
                <div className='w-1/3 flex items-end justify-end '>
                  <button
                    className='text-[#4F46E5] bg-white border rounded-2xl text-sm  border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white px-3 py-[7px] disabled:bg-[#DFE2E7] disabled:border-none disabled:text-zinc-400'
                    type='button'
                    disabled={cvIsUpdated}
                    onClick={() => {
                      setCvData(updatePreview);
                      setCvIUpdated(true);
                    }}
                  >
                    Update
                  </button>
                </div>
              )}
            </nav>
            <form
              noValidate={true}
              onSubmit={form.handleSubmit(handleSubmitForm, () => setIsFormSubmitted(true))}
            >
              <>
                <div className={`${tab === 'preview' ? 'bg-[#F3F4F6]' : 'pl-6'} flex w-full  `}>
                  <section
                    className={` ${tab !== 'preview' ? 'block' : 'hidden'} ${
                      tab === 'both'
                        ? 'w-1/2 2xl:h-[68vh] 3xl:h-[75vh] h-[67vh]  overflow-y-scroll'
                        : 'w-[50%] mx-auto'
                    } pb-6 pr-6 `}
                  >
                    <RefineWithAI submitHandler={enhanceCvWithAi} undoHandler={undoAiHandler} />
                    <Card
                      showTitle='CV'
                      setIsSectionOpen={setIsSectionOpen}
                      isSectionOpen={isSectionOpen}
                      noMargin={true}
                      noPadding={true}
                    >
                      <NormalInput
                        inputName='cv_name'
                        labelName='Name *'
                        placeholder='Enter CV name'
                        type='text'
                        registerOptions={{
                          required: 'CV name is required',
                          minLength: { value: 2, message: 'Enter at least 2 characters' },
                        }}
                        className='bg-gray-50 max-w-[264px]'
                        inputParentDivClasses='max-w-[264px]'
                      />

                      <h3 className='text-sm font-medium text-slate-900 pb-1 pt-10'>Type</h3>

                      <WhiteLabelRedberryToggle
                        checkRDBR={checkRDBR}
                        uniqueId={'edit_modal'}
                        checkWhiteLabel={checkWhiteLabel}
                        register={form.register}
                        i={0}
                        whiteLabelChecked={whiteLabelChecked!}
                        labelChoiceChangeHandler={redberryToggler}
                      />
                    </Card>

                    <CvEditDropdown options={sections} />

                    <div className={`${namingTabIsOpen && 'hidden'}`}>
                      <ul className='h-full flex flex-col gap-6 justify-between'>
                        <PersonalInformation
                          cvModal={'Personal information'}
                          setLocationIsChanged={setSkillsAreReordered}
                          setIsSectionOpen={setIsSectionOpen}
                          isSectionOpen={isSectionOpen}
                          location={form.watch('location')}
                        />
                        {sections
                          ?.filter((item) => item.selected)
                          ?.map((item, i) => {
                            return (
                              <li key={i}>
                                {item.title === 'Brief intro' && (
                                  <BriefIntroCard
                                    cvModal={'Brief intro'}
                                    setIsSectionOpen={setIsSectionOpen}
                                    isSectionOpen={isSectionOpen}
                                    enhanceCvWithAi={enhanceCvWithAi}
                                    undoAiHandler={undoAiHandler}
                                  />
                                )}
                                {item.title === 'Skills' && (
                                  <SkillsCard
                                    cvModal={'Skills'}
                                    isFormSubmitted={isFormSubmitted}
                                    setIsFormSubmitted={setIsFormSubmitted}
                                    skillsRef={skillsRef}
                                    setAreSkillsReordered={setSkillsAreReordered}
                                    setIsSectionOpen={setIsSectionOpen}
                                    isSectionOpen={isSectionOpen}
                                  />
                                )}
                                {item.title === 'Languages' && (
                                  <LanguageCard
                                    cvModal={'Language'}
                                    languages={languages}
                                    levels={levels}
                                    setIsSectionOpen={setIsSectionOpen}
                                    isSectionOpen={isSectionOpen}
                                  />
                                )}
                                {item.title === 'Education' && (
                                  <EducationCard
                                    cvModal={'Education'}
                                    setIsSectionOpen={setIsSectionOpen}
                                    isSectionOpen={isSectionOpen}
                                    enhanceCvWithAi={enhanceCvWithAi}
                                    undoAiHandler={undoAiHandler}
                                  />
                                )}
                                {item.title === 'Work Experience' && (
                                  <CompanyCard
                                    cvModal={'Experience'}
                                    setIsSectionOpen={setIsSectionOpen}
                                    isSectionOpen={isSectionOpen}
                                    enhanceCvWithAi={enhanceCvWithAi}
                                    undoAiHandler={undoAiHandler}
                                  />
                                )}
                                {item.title === 'Project portfolio' && (
                                  <ProjectCard
                                    cvModal={'Project portfolio'}
                                    setIsSectionOpen={setIsSectionOpen}
                                    isSectionOpen={isSectionOpen}
                                    enhanceCvWithAi={enhanceCvWithAi}
                                    undoAiHandler={undoAiHandler}
                                  />
                                )}
                                {item.title === 'Courses' && (
                                  <CourseCard
                                    cvModal={'Courses'}
                                    setIsSectionOpen={setIsSectionOpen}
                                    isSectionOpen={isSectionOpen}
                                  />
                                )}
                                {item.title === 'Achievement and Certifications' && (
                                  <AchievementsCard
                                    cvModal={'Achievement and Certifications'}
                                    setIsSectionOpen={setIsSectionOpen}
                                    isSectionOpen={isSectionOpen}
                                  />
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </section>

                  <section
                    className={`${tab !== 'sections' ? 'block' : 'hidden'} ${
                      tab === 'both'
                        ? 'w-1/2 pb-6 px-6 2xl:h-[68vh] 3xl:h-[75vh] h-[67vh] overflow-y-scroll'
                        : 'w-[50%] mx-auto px-6 mb-20'
                    }    bg-[#F3F4F6]  `}
                  >
                    <div className='flex flex-col items-center'>
                      {tab === 'both' && (
                        <div className='flex items-center justify-between pb-6 px-[2.5px] w-[600px] sticky top-0 bg-[#F3F4F6] z-999 pt-6'>
                          <h3 className='text-[#5A636F]'>Document Preview</h3>
                          <button
                            className='text-[#4F46E5] bg-white border rounded-2xl text-sm  border-[#4F46E5] px-3 py-[7px] disabled:bg-[#DFE2E7] disabled:border-none disabled:text-zinc-400 hover:bg-[#4F46E5] hover:text-white'
                            type='button'
                            disabled={cvIsUpdated}
                            onClick={() => {
                              setCvData(updatePreview);
                              setCvIUpdated(true);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      )}

                      <div className='bg-white rounded-md shadow-md w-[595px] min-h-[842px] '>
                        <PdfPreview data={cvData} canOverWriteCv={props.canOverWriteCv!} />
                      </div>
                    </div>
                  </section>

                  <div className='h-6'></div>
                </div>
              </>
              <div
                className={`${
                  tab === 'both' ? 'absolute bottom-0 left-0' : 'sticky left-0'
                } py-3 flex gap-4 px-6  bottom-0  w-full z-50 bg-white border-t border-zinc-200 `}
              >
                <button
                  className='px-3 py-2 border border-zinc-200 rounded-md ml-auto hover:bg-gray-300'
                  onClick={props.modalToggler}
                  type='button'
                >
                  Cancel
                </button>

                <button
                  className='flex items-center gap-2 px-3 py-2 border bg-indigo-600/25 border-indigo-600 hover:bg-indigo-800 rounded-md text-white disabled:cursor-progress'
                  type='submit'
                  disabled={isLoading}
                >
                  Export
                  {!isLoading || <Loader size='16px' border='2px' />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </PortalWrapper>
    </FormProvider>
  );
};

export default CvEditModal;
