'use client';
import { one, two, three } from 'assets/Invoices';
import { ServiceComponent } from 'components';
import { Props } from './types';
import { invoicing } from 'helpers';

const Invoices: React.FC<Props> = (props) => {
  const images = [one, two, three];

  return (
    <ServiceComponent
      refs={props.refs}
      services={invoicing}
      title='Automate invoice generation - eliminate human error'
      images={images}
    />
  );
};

export default Invoices;
