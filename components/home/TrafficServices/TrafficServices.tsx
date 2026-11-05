'use client';
import { two, one } from 'assets/Traffic';
import { ServiceComponentLeft } from 'components';
import { traffics } from 'helpers';
import { Props } from './types';

const TrafficServices: React.FC<Props> = (props) => {
  const images = [two, one];

  return (
    <ServiceComponentLeft
      refs={props.refs}
      services={traffics}
      title='Know where your utilization stands and forecast future demand-capacity sync'
      images={images}
    />
  );
};

export default TrafficServices;
