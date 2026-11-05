import { can, capitalizeFirstLetter } from 'helpers';
import { Props } from './types';
import { useProfileInfoSectionItems } from './useProfileInfoSectionItems';
import { ShowHide, Tooltip, TooltipContent, TooltipTrigger } from 'components';
import { CircleCheckIcon, CopyIcon } from 'lucide-react';

const ProfileInfoSectionItems: React.FC<Props> = (props) => {
  const {
    isItemHovered,
    setIsItemHovered,
    handleCopyClick,
    copyFormattedText,
    hideValue,
    setHideValue,
    itemIsCopied,
    setItemIsCopied,
    textValue,
    formattedValue,
    contentRef,
    user,
  } = useProfileInfoSectionItems(
    props.value,
    props.isSensitive ? props.isSensitive.hide : false,
    props.textToCopy,
    props.disableCopy,
  );

  const canCapitalize = !props.canNotCapitalize
    ? capitalizeFirstLetter(textValue as string)
    : textValue;

  return (
    <div
      className={`${props.className} ${
        props.textArea ? '' : 'truncate'
      } flex justify-between items-center w-full h-12 hover:bg-muted-foreground/10 rounded-md px-3 cursor-default transition-colors`}
      onMouseEnter={() => setIsItemHovered(true)}
      onMouseLeave={() => {
        setIsItemHovered(false);
        setItemIsCopied(false);
      }}
    >
      <div className={`${props.textArea ? 'w-[12%] pr-2' : 'w-[30%] pr-5'} text-zinc-400 `}>
        {props.title}
      </div>
      <div
        className={`${
          props.textArea && textValue
            ? 'items-start justify-start w-[90%]'
            : !textValue
            ? ''
            : 'truncate w-[80%] justify-end gap-4'
        } flex `}
      >
        <div className={`${isItemHovered ? 'opacity-100' : 'opacity-0'} flex items-center gap-2 `}>
          <Tooltip open={itemIsCopied ? true : undefined}>
            <TooltipTrigger
              render={
                <button
                  type='button'
                  onClick={props.textArea ? copyFormattedText : handleCopyClick}
                  className={`${
                    !hideValue && !props.disableCopy && textValue
                      ? 'opacity-100'
                      : 'opacity-0 hidden'
                  } `}
                >
                  {itemIsCopied ? (
                    <CircleCheckIcon size={16} className='text-success' />
                  ) : (
                    <CopyIcon size={16} className='text-muted-foreground' />
                  )}
                </button>
              }
            />
            {itemIsCopied && <TooltipContent side='left'>Copied</TooltipContent>}
          </Tooltip>

          {(can('employee::salary-view', user?.permissions) || user.id === props.employeeId) && (
            <button
              type='button'
              className={`${
                props.isSensitive
                  ? 'opacity-100'
                  : 'opacity-0 select-none pointer-events-none -z-10 indent-3999996'
              }`}
              onClick={() => setHideValue((prev) => !prev)}
            >
              <ShowHide show={!hideValue || false} />
            </button>
          )}
        </div>

        <div
          className={`${props.textArea ? 'w-full' : ' justify-end '} ${
            props.valueClassName
          } flex items-center text-zinc-700 truncate`}
          title={
            !props.disableCopy && !props.textArea
              ? typeof props.value !== 'string'
                ? props.textToCopy
                : props.value
              : ''
          }
          ref={contentRef}
        >
          {hideValue ? '●●●●' : canCapitalize ? formattedValue : '-'}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSectionItems;
