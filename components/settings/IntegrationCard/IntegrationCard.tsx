import React from 'react';
import { Props } from './types';

const IntegrationCard: React.FC<Props> = ({
  name,
  description,
  redirectPage,
  logo,
  isConnected,
  hideDisconnect,
  disconnectHandler,
  alwaysShowConfigure,
  isLoading,
}) => {
  const handleAction = () => {
    window.location.href = redirectPage;
  };

  return (
    <div className='rounded-2xl border shadow-xs bg-cyan-50 px-6 py-4 flex justify-between'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-3'>
          {logo}
          <div className='flex-col gap-1'>
            <h2 className='font-semibold text-lg flex items-center gap-2'>{name} Integration</h2>
            <p className='text-sm text-gray-600'>{description}</p>
          </div>
        </div>

        <div className='flex gap-2'>
          {(!isConnected || alwaysShowConfigure) && (
            <button
              className='px-4 py-2 rounded-sm text-white text-sm font-medium w-fit mt-2 bg-green-500 hover:bg-green-600'
              onClick={handleAction}
            >
              Configure
            </button>
          )}

          {isConnected && !hideDisconnect && (
            <button
              className='px-4 py-2 rounded-sm text-white text-sm font-medium w-fit mt-2 bg-red-500 hover:bg-red-600'
              onClick={() => disconnectHandler?.(name.toLocaleLowerCase())}
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      <div>
        {isLoading ? (
          <p className='animate-pulse h-4 bg-gray-200 w-32 rounded-md'></p>
        ) : isConnected ? (
          <span className='text-green-600 font-medium'>● Connected</span>
        ) : (
          <span className='text-orange-500 font-medium'>● Not Connected</span>
        )}
      </div>
    </div>
  );
};

export default IntegrationCard;
