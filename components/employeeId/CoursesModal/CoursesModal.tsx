import { CourseCard, Modal } from 'components';
import { Props } from './types';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const getInitialValues = (values: Props['defaultValues']) => {
  return values.courses.length
    ? values
    : {
        courses: [
          {
            school: '',
            course_name: '',
            current: false,
            start_date: '',
            end_date: '',
            certification: null,
            attach_link: '',
            id: null,
            course_id: null,
            delete_existing_file: 0,
            order: 1,
          },
        ],
      };
};

const CoursesModal: React.FC<Props> = (props) => {
  const form = useForm({
    defaultValues: getInitialValues(props.defaultValues),
    mode: 'onSubmit',
  });

  return (
    <Modal
      title='Courses'
      open={props.isModalOpen}
      onOpenChange={(open) => {
        if (open === false) {
          form.reset(getInitialValues(props.defaultValues));
          props.setRemovedItems([]);
        }

        props.toggleModal();
      }}
      onConfirm={() => props.submitHandler(form.getValues('courses'), form)}
      loading={props.loading}
    >
      <FormProvider {...form}>
        <CourseCard setRemovedItems={props.setRemovedItems} />
      </FormProvider>
    </Modal>
  );
};

export default CoursesModal;
