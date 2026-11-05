import { ErrorCircle, X } from 'components/icons';
import { ErrorModal } from '../ErrorModal';
import { Loader } from '../CSSLoader';
import { Props } from './types';
import { useSubCategory } from './useSubCategory';

const SubCategory: React.FC<Props> = (props) => {
  const {
    subCategoryCheckHandler,
    deleteHandler,
    deleting,
    needsToConfirmDelete,
    setNeedsToConfirmDelete,
  } = useSubCategory(
    props.addNewCondition,
    props.removeConditionHandler,
    props.setSavedFiltersState,
  );

  return (
    <div className='flex items-center w-full rounded-md  justify-between py-2 pl-10 pr-2 hover:bg-gray-100'>
      {needsToConfirmDelete && (
        <ErrorModal
          confirmText='Delete'
          modalMessage='Are you sure you want to delete this filter? it will be removed for all users'
          modalTitle='Delete'
          confirmButtonColor='bg-red-600'
          confirmButtonFocusColor='focus:ring-red-500'
          confirmButtonHoverColor='hover:bg-red-700'
          icon={<ErrorCircle className='h-12 w-12' />}
          iconBackgroundColor='bg-red-100'
          closeHandler={() => {
            setNeedsToConfirmDelete(false);
          }}
          confirmFunction={() => {
            deleteHandler(props.subCategory.id, false);
          }}
          isLoading={deleting}
          backdropClasses='opacity-50'
        />
      )}
      <label
        htmlFor={
          (`${props.subCategory?.id?.toString()}/${props.type}` || props.subCategory.title) ??
          props.subCategory.name
        }
        className={`flex ${
          props.isChild ? 'pl-8' : ''
        } items-center justify-between gap-2 w-full cursor-pointer`}
      >
        <div className='flex items-start flex-col space-y-1'>
          <span>
            {props.fieldIsEmployee
              ? `${props.subCategory.first_name} ${props.subCategory.last_name}`
              : props.subCategory.title ?? props.subCategory.name}
          </span>
          {props.subCategory.filter_type === 'saved' && (
            <span className='text-zinc-400 text-xs'>
              {props.subCategory?.meta?.isPrivate ? 'Private' : 'Public'}
            </span>
          )}
        </div>
        <input
          onChange={(e) =>
            subCategoryCheckHandler(e, {
              type: props.type,
              value: props.fieldIsEmployee
                ? `${props.subCategory.first_name} ${props.subCategory.last_name}`
                : props.subCategory.title ?? props.subCategory.name,
              isIsNot: true,
              ConditionIsAnd: true,
              childConditions: [],
              id: props.subCategory?.id,
              isChild: props.isChild,
              shouldDefaultToAndInInsideCondition:
                props.subCategory.shouldDefaultToAndInInsideCondition,
              filter_type: props.filter_type,
              meta: props.subCategory.meta,
              children: props.subCategory?.children,
            })
          }
          type='checkbox'
          id={
            (`${props.subCategory?.id?.toString()}/${props.type}` || props.subCategory.title) ??
            props.subCategory.name
          }
          checked={props.checkedCondition}
          className={props.subCategory.type === 'saved' ? 'hidden' : ''}
        />
      </label>
      {props.subCategory.meta?.isPrivate || props.subCategory.meta?.isMadeByThisUser ? (
        deleting ? (
          <div>
            <Loader size='16px' border='2px' />
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteHandler(
                props.subCategory.id,
                props.subCategory.meta?.isMadeByThisUser && !props.subCategory.meta?.isPrivate,
              );
            }}
          >
            <X className='w-3 h-3' />
          </button>
        )
      ) : (
        ''
      )}
    </div>
  );
};

export default SubCategory;
