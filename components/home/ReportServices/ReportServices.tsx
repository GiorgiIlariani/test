'use client';
import { one, two, three } from 'assets/Reports';
import { ServiceComponent } from 'components';
import { reports } from 'helpers';
import { Props } from './types';

const ReportServices: React.FC<Props> = (props) => {
  const images = [one, two, three];

  return (
    <ServiceComponent
      refs={props.refs}
      services={reports}
      title='Drive strategic decisions with precise financial forecasts and analytics'
      images={images}
    />
  );
};

export default ReportServices;
