import React from 'react';
import { Props } from './types';
import { LargeArrow } from 'components/icons';
import { SectionNamePdf } from 'types';
import { useRemoveAnimatedNodes } from 'hooks';
import { cn } from 'lib';

const Card: React.FC<Props> = (props) => {
  const { removeNodes } = useRemoveAnimatedNodes({
    condition: props.isSectionOpen?.[props.showTitle as SectionNamePdf].isOpen,
    duration: 150,
  });
  return (
    <div
      className={`rounded-md bg-white ${!props.noPadding && 'p-4'} flex ${
        props.extraClasses
      } flex-col ${props.noMargin ? '' : 'space-y-6'} ${
        props.showTitle ? 'border border-[#DFE2E7] rounded-md p-6' : ''
      } z-10`}
    >
      {props.showTitle && (
        <div className='flex items-center justify-between'>
          <h2 className='font-bold  text-slate-900'>{props.showTitle}</h2>
          <button
            type='button'
            className={`${
              props.isSectionOpen?.[props.showTitle].isOpen ? 'rotate-0' : 'rotate-180'
            } transition-all duration-500 hover:opacity-50`}
            onClick={() =>
              props.setIsSectionOpen?.((prev) => ({
                ...prev,
                [props.showTitle as SectionNamePdf]: {
                  isOpen: !prev[props.showTitle as SectionNamePdf].isOpen,
                },
              }))
            }
          >
            <LargeArrow />
          </button>
        </div>
      )}

      <div
        className={cn(
          props.showTitle && `${removeNodes} pt-6 transition-opacity ease-in`,
          props.childrenWrapperClassName,
        )}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Card;
