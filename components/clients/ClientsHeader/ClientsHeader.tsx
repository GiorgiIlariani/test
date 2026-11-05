import { AddButton } from 'components';
import { can } from 'helpers';
import { ClientsHeaderProps } from './types';

const ClientsHeader: React.FC<ClientsHeaderProps> = ({ permissions, onOpen }) => {
  return (
    <div className='flex items-center justify-between mb-8'>
      <h1 className='text-2xl font-bold'>Clients</h1>

      {can('project::update', permissions) && (
        <AddButton
          buttonText={'Add a Client'}
          className='rounded-md bg-[#4F46E5] hover:bg-indigo-800 px-6 py-3 text-sm text-white'
          onClick={onOpen}
        />
      )}
    </div>
  );
};

export default ClientsHeader;
