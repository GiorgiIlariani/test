import { Props } from './types';

const DynamicSelectListItem: React.FC<Props> = (props) => {
  return (
    <li
      key={props.i}
      className='flex w-48 justify-between items-center  py-2 font-medium cursor-pointer relative'
    >
      <div className='flex gap-1 justify-start items-center w-full'>
        {!props.item?.id && props.canCreateListItem && (
          <button
            type='button'
            onClick={() => {
              props.createItemHandler(props.item);
            }}
            className='text-zinc-600 text-start'
          >
            create
          </button>
        )}
        <button
          type='button'
          className='font-normal truncate'
          onClick={() => {
            !props.item?.id && props.canCreateListItem
              ? props.createItemHandler(props.item)
              : props.selectItemHandler(props.item);

            props.inputType === 'department' && props.resetServiceInput();
          }}
        >
          {props.item.title}
        </button>
      </div>
    </li>
  );
};

export default DynamicSelectListItem;
