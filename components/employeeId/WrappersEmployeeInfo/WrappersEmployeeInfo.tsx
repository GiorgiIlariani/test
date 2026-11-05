import { UploadAvatar } from 'components';
import { Props } from './types';
import { useWrappersEmployeeInfo } from './useWrappersEmployeeInfo';
import { formatDate, generateAvatarSrc } from 'helpers';

const WrappersEmployeeInfo: React.FC<Props> = (props) => {
  const { handleAvatarChange } = useWrappersEmployeeInfo(props.refetch, props.employee);

  return (
    <div className='flex items-center space-x-4'>
      <UploadAvatar
        avatar={
          props.employee.avatar ??
          generateAvatarSrc(props.employee.first_name, props.employee.last_name)
        }
        externalOnChange={handleAvatarChange}
        userId={props.employee.id}
      />

      <div className='flex flex-col gap-2'>
        <h1 className='font-medium capitalize text-slate-900'>
          {props.employee.first_name} {props.employee.last_name}
        </h1>
        <p className='text-xs text-zinc-400'>
          <span>
            Last updated at {formatDate(props.employee?.updated_at_from_ui as string)}
            {props.employee?.last_updated_by?.name && ` by ${props.employee.last_updated_by?.name}`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default WrappersEmployeeInfo;
