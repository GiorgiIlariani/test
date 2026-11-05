import { JakeTheDog, X } from 'components';
import React from 'react';
import { useWelcomeMessage } from './useWelcomeMessage';
import { JakeTheDogGif } from 'assets';
import Image from 'next/image';
import { WELCOME_MESSAGE } from 'config';
import { Props } from './types';

const WelcomeMessage: React.FC<Props> = (props) => {
  const { closeMessage, isOpen, openMessage, shouldJakeAnimate, buttonRef, messageRef } =
    useWelcomeMessage(props.welcomeMessageIsNew);
  return (
    <>
      <div
        className={`fixed ${
          !isOpen && 'opacity-0 pointer-events-none'
        } transition-all p-6 rounded-xl shadow-xs max-w-104 flex bottom-28 md:bottom-12 right-10 md:right-44 ml-10 bg-white border border-gray-100`}
        ref={messageRef}
      >
        <div className='mr-4 bg-gray-50 shrink-0 justify-center rounded-full w-10 h-10 flex items-center'>
          <JakeTheDog />
        </div>

        <div className='text-sm'>
          {WELCOME_MESSAGE.map((message, i) => {
            return (
              <div
                className={`${i === WELCOME_MESSAGE.length - 1 && 'w-fit ml-auto mt-8'}`}
                dangerouslySetInnerHTML={{
                  __html: message,
                }}
                key={i}
              ></div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          if (isOpen) {
            closeMessage();
          } else {
            openMessage();
          }
        }}
        ref={buttonRef}
        className='fixed flex items-center justify-center w-14 h-14 bg-white border border-gray-100 bottom-10 md:bottom-12 right-10 md:right-26 shadow-xs rounded-full p-2.5'
      >
        {!isOpen ? (
          shouldJakeAnimate ? (
            <Image
              height={100}
              width={100}
              alt='Jake the dog'
              src={JakeTheDogGif.src}
              className='w-9 h-9'
            />
          ) : (
            <JakeTheDog classNames='w-9 h-9' />
          )
        ) : (
          <X />
        )}
      </button>
    </>
  );
};

export default WelcomeMessage;
