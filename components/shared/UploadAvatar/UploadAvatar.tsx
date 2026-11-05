import { generateRandomString } from 'helpers';
import { useUploadAvatar } from './useUploadAvatar';
import { CameraIcon } from 'components';
import Image from 'next/image';

const UploadAvatar = (props: {
  avatar: string;
  disabled?: boolean;
  externalOnChange?: () => void;
  userId: number;
}) => {
  const { handleAvatarChange, deleteAvatar, setIsOpen, avatarSrc, isOpen, ref, canUploadImage } =
    useUploadAvatar(props.avatar, props.externalOnChange, props.userId);

  return (
    <section
      className={!props.disabled ? 'group relative cursor-pointer' : 'pointer-events-none'}
      onClick={() => !props.disabled && setIsOpen((prev) => !prev)}
    >
      <Image
        src={avatarSrc instanceof File ? URL.createObjectURL(avatarSrc) : props.avatar}
        width={150}
        height={150}
        className={`w-16 h-16 object-cover rounded-full ${generateRandomString()}`}
        alt={`${
          props.avatar.includes('svg+xml') ? 'generated avatar' : 'avatar'
        }?${generateRandomString()}`}
        id={props.avatar.includes('svg+xml') ? `${generateRandomString()}` : 'avatar'}
      />
      {!props.disabled && canUploadImage ? (
        <>
          <div
            className={`${
              isOpen ? 'block' : 'hidden'
            } group-hover:block p-1 bg-white border border-[#DFE2E7] rounded-full absolute -right-1 -bottom-1 z-10`}
          >
            <CameraIcon />
          </div>
          <div className='group-hover:bg-[#050F26]/20 transition-opacity absolute inset-0 bg-[#050F26]/0 z-0 rounded-full' />

          <div
            className={`${
              isOpen ? 'block' : 'hidden'
            } absolute z-50 w-52 translate-x-18 -translate-y-6`}
            ref={ref}
          >
            <div className='py-4 bg-white rounded-md flex flex-col gap-1 border border-[#F3F4F6] shadow-xs'>
              <label className='cursor-pointer px-4 py-2 hover:bg-[#F3F4F6]'>
                Change profile picture
                <input
                  hidden
                  type='file'
                  onChange={handleAvatarChange}
                  accept='image/png, image/jpeg, image/jpg, image/bmp'
                />
              </label>
              <div className='px-4 py-2 hover:bg-[#F3F4F6]' onClick={deleteAvatar}>
                Delete
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
};

export default UploadAvatar;
