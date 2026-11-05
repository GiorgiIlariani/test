import { Backdrop, PortalWrapper, XButton } from 'components';
import { twMerge } from 'tailwind-merge';
import { Props } from './Props';
import { useEsc } from 'hooks';

const ModalPortalWrapper: React.FC<Props> = ({
  children,
  onClose,
  clickableOutside = true,
  keepModalInCenter = false,
  hideCloseButton = false,
  hideHeader = false,
  title,
  titleSuffix,
  subtitle,

  wrapperClassName,
  backdropClassName,
  modalClassName,
  headerClassName,
  titleClassName,
  subTitleClassName,
}) => {
  useEsc(onClose);

  return (
    <PortalWrapper>
      <div
        className={twMerge(
          'fixed inset-0 z-9999 flex items-end justify-center md:items-center',
          keepModalInCenter && 'items-center',
          wrapperClassName,
        )}
      >
        <Backdrop
          onClick={clickableOutside ? onClose : undefined}
          className={twMerge('animate-fade-in', backdropClassName)}
        />

        <div
          className={twMerge(
            'relative overflow-auto overscroll-none animate-slide-up bg-white text-slate-900 rounded-t-3xl w-full h-fit max-h-[min(45rem,calc(100dvh-4rem))] md:animate-scale-in md:max-w-[min(35rem,calc(100dvw-4rem))] md:rounded-3xl',
            keepModalInCenter &&
              'max-w-[min(35rem,calc(100dvw-4rem))] rounded-3xl animate-scale-in',
            modalClassName,
          )}
        >
          {!hideHeader && (
            <div
              className={twMerge(
                'flex items-start justify-between p-6 sticky top-0 bg-white z-10 w-full border-b border-gray-100',
                headerClassName,
                (!title || !subtitle) && 'items-center',
              )}
            >
              <div className='flex flex-col gap-0.5'>
                {title && (
                  <p className={twMerge('text-xl font-bold', titleClassName)}>
                    {title} {titleSuffix}
                  </p>
                )}
                {subtitle && (
                  <span className={twMerge('text-sm text-zinc-400', subTitleClassName)}>
                    {subtitle}
                  </span>
                )}
              </div>

              {!hideCloseButton && <XButton onClick={onClose} />}
            </div>
          )}

          {children}
        </div>
      </div>
    </PortalWrapper>
  );
};

export default ModalPortalWrapper;
