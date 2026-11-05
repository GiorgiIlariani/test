'use client';
import { one, two, three, four, five } from 'assets';
import { ServiceComponent } from 'components';
import { employeeManagement } from 'helpers';
import { Props } from './types';

const EmployeeService: React.FC<Props> = (props) => {
  const images = [one, two, three, four, five];

  return (
    <ServiceComponent
      refs={props.refs}
      services={employeeManagement}
      title='Take seconds to match employees with projects based on their skills'
      images={images}
    />
  );
};

export default EmployeeService;
