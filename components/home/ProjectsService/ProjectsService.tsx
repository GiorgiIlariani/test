'use client';
import { one, two, three, four } from 'assets/ProjectImages';
import { ServiceComponentLeft } from 'components';
import { projects } from 'helpers';
import { Props } from './types';

const ProjectsService: React.FC<Props> = (props) => {
  const images = [one, two, three, four];

  return (
    <ServiceComponentLeft
      refs={props.refs}
      services={projects}
      title='Monitor real-time margins and agreement statuses'
      images={images}
    />
  );
};

export default ProjectsService;
