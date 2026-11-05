import React from 'react';
import { months } from '../IncomeStatementInputs/helpers';
import { Props } from './types';

const IncomeStatementTableLoader: React.FC<Props> = (props) => {
  return (
    <div>
      <ul>
        {Array.from(Array(props.itemNumber ?? 2).keys()).map((field, index) => (
          <li
            className={`${
              !props.mainTableLoader ? 'gap-6' : ' gap-10 border pb-5'
            }  flex flex-col gap-6 border-gray-100 w-fit bg-white relative`}
            key={index}
          >
            <div className='grid grid-flow-col grid-cols-first-longer-and-13-even'>
              <div
                className={`${
                  !props.mainTableLoader ? 'px-8' : 'pr-24'
                } w-full flex border-x border-zinc-200 items-center pt-[0.83rem] pb-6 gap-x-4`}
              >
                {props.isOtherAdmin && (
                  <div
                    className={`${
                      !props.mainTableLoader ? 'z-30' : 'z-10'
                    } ml-6 mr-2 text-gray-300 w-full h-7 mb-2 -mt-1 bg-gray-300 animate-pulse select-none`}
                  ></div>
                )}
                <div
                  className={`${props.isOtherAdmin ? 'ml-0' : 'ml-8'} ${
                    !props.mainTableLoader ? 'z-30 h-7 mb-2 -mt-1' : 'z-10 h-8'
                  } text-gray-300 w-full bg-gray-300 animate-pulse select-none `}
                ></div>
              </div>
              {months?.map((month: (typeof months)[number]) => (
                <div
                  className={`pt-[0.83rem] pb-6 px-6 ${
                    month !== 1 && 'border-l'
                  } border-zinc-200 flex gap-12`}
                  key={month}
                >
                  <div
                    className={`${
                      !props.mainTableLoader ? 'z-30 h-7 mb-2 -mt-1' : 'z-0 h-8'
                    } text-gray-300 w-full bg-gray-300 animate-pulse select-none`}
                  ></div>
                </div>
              ))}
            </div>
            <div className='-mt-[3.8rem]'></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeStatementTableLoader;
