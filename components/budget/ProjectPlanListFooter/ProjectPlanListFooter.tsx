import { Props } from './types';
import React from 'react';
import { CostIcon, ProfitIcon } from 'components/icons';
import { getCurrencySymbol, convertNumbersAsPrice, generateAvatarSrc } from 'helpers';

const ProjectPlanListFooter: React.FC<Props> = (props) => {
  return (
    <div className='flex items-center justify-between w-full h-full mt-2.5 border-t pt-4 '>
      <div className='flex items-center'>
        <div className='flex items-center gap-2 text-zinc-700  text-xs'>
          <p className=''>Revenue</p>
          <div className='font-bold flex items-center gap-1'>
            <p className='w-2'> {getCurrencySymbol(props.currency)}</p>
            {convertNumbersAsPrice(props.total)}
          </div>
        </div>
        <div className='h-3 w-px mx-5 bg-gray-100' />
        <div className='flex justify-center gap-5 text-zinc-700'>
          <div className='flex items-center justify-start text-xs gap-1'>
            <CostIcon />

            <p className='flex items-center gap-1'>
              <span>{getCurrencySymbol(props.currency)}</span>
              {convertNumbersAsPrice(props.cost)}
            </p>
          </div>

          <div className='flex items-center justify-start text-xs gap-1'>
            <ProfitIcon />

            <p className='flex items-center gap-1'>
              <span>{getCurrencySymbol(props.currency)}</span>
              {convertNumbersAsPrice(props.gross_profit)}
              <span className=''> {`(${Math.round(props.gross_profit_percentage)}%)`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-1 mr-2'>
        <ul className='flex items-center relative'>
          {props.employees?.slice(0, 3)?.map((el, i) => {
            const user = props.minimalUsers?.find((item) => item.id === el.employee_id);
            return (
              <li
                key={el.employee_id}
                className='absolute -top-[0.6rem]  w-[1.125rem] h-[1.125rem]'
                style={{ right: i * 12 }}
              >
                <img
                  className={`border border-white rounded-full object-cover w-full h-full`}
                  width={100}
                  height={100}
                  src={
                    user?.avatar ??
                    generateAvatarSrc(user?.title?.split(' ')?.[0]!, user?.title?.split(' ')?.[1])
                  }
                  alt={'icon'}
                />
              </li>
            );
          })}
        </ul>
        {props.employees?.length > 3 && (
          <p className='text-[#5A636F] text-xs font-medium'>+ {props.employees?.length - 3}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectPlanListFooter;
