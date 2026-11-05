import { Props } from './types';
import React from 'react';
import { useCommonDropdown } from './useCommonDropdown';
import { DownChevron } from 'components';

const CommonDropdown: React.FC<Props> = (props) => {
  const { openModalHandler, buttonRef, dropDownRef } = useCommonDropdown(props.setModalIsOpen);
  return (
    <div className='relative'>
      <div
        ref={buttonRef}
        className={`${props.boxClassName} hover:bg-gray-200 flex relative capitalize text-zinc-700 justify-between truncate items-center px-[10px] text-sm py-[10px] rounded-md border border-gray-300 bg-white font-medium shadow-xs ring-offset-1 ring-offset-white transition-all focus:ring-2  cursor-pointer`}
        onClick={() => openModalHandler()}
      >
        <p>{props.selectedItem}</p>
        <DownChevron shouldFlipAbove={props.modalIsOpen} />
      </div>
      {props.modalIsOpen && (
        <div
          ref={dropDownRef}
          className={`${props.className} absolute rounded-md border bg-white border-gray-300 z-99999`}
        >
          <ul className='max-h-48 overflow-auto'>
            {props.list?.map((item) => (
              <li
                key={item}
                className='hover:bg-[#F3F4F6] text-sm  w-full py-3 text-start  pl-[10px] hover:rounded-md transition-all duration-300 capitalize cursor-pointer'
                onClick={() => props.selectItemHandler(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommonDropdown;
