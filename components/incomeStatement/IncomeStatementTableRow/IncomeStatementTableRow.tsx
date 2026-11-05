import { Props } from './types';
import React from 'react';
import { useIncomeStatementTableRow } from './useIncomeStatementTableRow';
import { ChevronLeft } from 'components/icons';
import { getFormattedNumber } from './helpers';
import SandClock from 'components/icons/SandClock';

const IncomeStatementTableRow: React.FC<Props> = (props) => {
  const { formatter, toggleOpen, isOpen } = useIncomeStatementTableRow(props.currency);
  return (
    <div className={`${!props.removeBorderY && 'border-t'} border-gray-100  w-fit bg-white`}>
      <div className='grid grid-flow-col grid-cols-first-longer-and-13-even'>
        <div
          onClick={toggleOpen}
          className={`${
            props.children && 'cursor-pointer hover:bg-[#F3F4F6]'
          } flex sticky left-0 bg-white z-1 border-x border-zinc-200 items-center ${
            props.titleClasses
          } gap-x-4 `}
        >
          {props.children && !!!props.hideChevron && (
            <ChevronLeft className={`transition-all ${isOpen ? 'rotate-90!' : 'rotate-0!'}`} />
          )}

          {!props.isDoubleTitle ? (
            <span className='text-zinc-700 flex items-center gap-2'>
              {props.title}
              {props.isBooked && (
                <div className='relative group/booked'>
                  <SandClock />
                  <div className='absolute bottom-full -left-7 mb-2 w-max p-2 bg-white border border-gray-200 shadow-xs text-zinc-700 text-xs rounded-sm opacity-0 group-hover/booked:opacity-100 z-50'>
                    Has booked terms
                  </div>
                </div>
              )}
            </span>
          ) : (
            <div className='flex items-center justify-center h-full w-full pl-3'>
              <p className='pl-[3.2rem] border-r w-1/2 h-full flex items-center'>
                {props.doubleFirstCol}
              </p>
              <p className='pl-4 w-1/2 h-full flex items-center'>{props.doubleSecondCol}</p>
            </div>
          )}
        </div>
        {props.values?.map((el, i) => (
          <div
            className={`py-4 pl-6 ${i && 'border-l'} border-zinc-200 flex items-center gap-2 `}
            key={i}
          >
            {getFormattedNumber(
              formatter,
              (el as { total: number }).total ? (el as { total: number }).total : (el as number),
              props.percentageValues,
              props.negativeValues,
            )}
            {(el as { hasBooked: boolean }).hasBooked && (
              <div className='relative group/booked'>
                <SandClock />
                <div className='absolute bottom-full -left-7 mb-2 w-max p-2 bg-white border border-gray-200 shadow-xs text-zinc-700 text-xs rounded-sm opacity-0 group-hover/booked:opacity-100 z-50'>
                  Includes booked terms
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {isOpen && props.children}
    </div>
  );
};

export default IncomeStatementTableRow;
