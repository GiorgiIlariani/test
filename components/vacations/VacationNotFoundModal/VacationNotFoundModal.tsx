import { ThinLineTrashCan } from 'components/icons';
import { ModalPortalWrapper, XButton } from 'components/shared';
import React from 'react';
import { Props } from './types';

const VacationNotFoundModal: React.FC<Props> = (props) => {
  return (
    <ModalPortalWrapper onClose={props.closeHandler} hideHeader keepModalInCenter>
      <div className='flex justify-end p-6 pb-0'>
        <XButton onClick={props.closeHandler} />
      </div>

      <div className='px-6 pb-10 pt-0 flex flex-col items-center justify-center'>
        <div className='flex items-center justify-center'>
          <div className='p-4 rounded-full bg-red-200'>
            <ThinLineTrashCan className='w-20 h-20' />
          </div>
        </div>

        <h1 className='text-redberry-red mt-4 text-center text-lg'>
          We can not find this vacation in our records 😢
        </h1>
      </div>
    </ModalPortalWrapper>
  );
};

export default VacationNotFoundModal;
