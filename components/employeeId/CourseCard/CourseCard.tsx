import { Props } from './types';
import React from 'react';
import { useCourseCard } from './useCourseCard';
import { Card, Courses, Button } from 'components';
import { CirclePlusIcon } from 'lucide-react';

const CourseCard: React.FC<Props> = (props) => {
  const { addCourse, remove, fields } = useCourseCard();

  return (
    <Card
      childrenWrapperClassName='space-y-15'
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      {fields?.map((courses, i) => (
        <Courses
          index={i}
          key={courses.course_id ?? courses.id}
          canNotEdit={props.canNotEdit}
          remove={remove}
          setRemovedItems={props.setRemovedItems}
          id={courses.course_id as number}
          cvModal={Boolean(props.cvModal)}
        />
      ))}

      <div className='flex justify-end w-full'>
        <Button type='button' variant='default-outline' onClick={addCourse}>
          <CirclePlusIcon />
          Add new course
        </Button>
      </div>
    </Card>
  );
};

export default CourseCard;
