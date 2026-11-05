import { Props } from './types';
import React from 'react';
import { DownChevron } from 'components';
import { useYearsDropDown } from './useYearsDropDown';
import { analytics } from 'helpers';

const YearsDropDown: React.FC<Props> = (props) => {
  const { openModalHandler, modalIsOpen, buttonRef, dropDownRef, listOfYears, setModalIsOpen } =
    useYearsDropDown(props);
  return (
    <div className='relative'>
      <div
        ref={buttonRef}
        className='flex relative hover:bg-gray-200 text-zinc-700 text-sm justify-between w-22 items-center px-4 py-[10px] rounded-md border border-gray-300 bg-white font-medium shadow-xs ring-offset-1 ring-offset-white transition-all focus:ring-2  cursor-pointer'
        onClick={() => openModalHandler()}
      >
        <p>{props.currentYear}</p>
        <DownChevron shouldFlipAbove={modalIsOpen} />
      </div>
      {modalIsOpen && (
        <div
          ref={dropDownRef}
          className='absolute w-22 rounded-md border  bg-white  border-gray-300 z-99999'
        >
          <ul>
            {listOfYears
              .filter((year) => year !== props.currentYear)
              ?.map((year) => (
                <li
                  key={year}
                  className='hover:bg-[#F3F4F6] text-sm  w-full py-4 text-start  pl-4 hover:rounded-md transition-all duration-300 capitalize cursor-pointer'
                  onClick={() => {
                    analytics.track(`${props.page} - Selected year ${year}`);
                    props.selectYearHandler(year);
                    setModalIsOpen(false);
                  }}
                >
                  {year}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YearsDropDown;
