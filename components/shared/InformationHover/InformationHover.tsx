import { Props } from './types';
import React from 'react';
import { InfoCircle } from 'components/icons';

const InformationHover: React.FC<Props> = (props) => {
  return (
    <>
      {props.customIcon ?? (
        <InfoCircle
          className={`${props.iconClassName} w-3 peer cursor-pointer' pathClassName='stroke-gray-500`}
        />
      )}
      <div
        className={`absolute ${props.extraHoverClasses} hidden hover:block peer-hover:block bg-white text-xs max-w-xs w-max p-2 rounded-lg top-1 -translate-y-full border border-gray-300 -right-4`}
      >
        {props.text}
      </div>
    </>
  );
};

export default InformationHover;
