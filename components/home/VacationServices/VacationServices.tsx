'use client';
import { one, two, three } from 'assets/Vacations';
import { ServiceComponentLeft } from 'components';
import { vacations } from 'helpers';
import { Props } from './types';

const VacationServices: React.FC<Props> = (props) => {
  const images = [three, two, one];

  return (
    <ServiceComponentLeft
      refs={props.refs}
      services={vacations}
      title='Efficiently manage billable employee time offs and impacted invoices'
      images={images}
    />
  );
};

export default VacationServices;
