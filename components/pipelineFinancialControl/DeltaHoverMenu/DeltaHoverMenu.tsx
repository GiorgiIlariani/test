import { convertNumbersAsPrice } from 'helpers';
import { Props } from './types';
import { useDeltaHoverMenu } from './useDeltaHoverMenu';

const DeltaHoverMenu: React.FC<Props> = (props) => {
  const { isOpen, ref, handleClickMenu } = useDeltaHoverMenu(props);
  return (
    <div
      className={`cursor-pointer ${
        props.rowNum - 1 > props.footerRow && !isOpen ? 'hidden ' : 'flex'
      } absolute inset-0  justify-center`}
      onClick={handleClickMenu}
      ref={ref}
    >
      <div
        className={`${
          isOpen ? 'group-hover:opacity-100 group-hover:scale-100' : 'opacity-0 scale-0'
        } flex flex-col text-sm leading-6 gap-2 transition-all absolute -inset-5 ${
          props.rowNum > 1
            ? `${props.rowNum > props.footerRow ? '-top-28' : '-top-24'} origin-bottom`
            : 'top-14 origin-top'
        } ${
          !props.footerRow && props.rowNum - props.footerRow === 1 ? '-top-4!' : ''
        } z-10 bg-white border border-gray-100 rounded-md p-3 h-28 ${props.className}`}
      >
        <p>🤒 {convertNumbersAsPrice(props.sick_leave ?? 0)}</p>
        <p>🌴 {convertNumbersAsPrice(props.vacation ?? 0)}</p>
        <p>💼 {convertNumbersAsPrice(props.other ?? 0)}</p>
      </div>
      <div
        className={`w-5 h-5 absolute origin-top ${
          isOpen ? 'group-hover:opacity-100 group-hover:scale-100' : 'opacity-0 scale-0'
        } ${
          props.rowNum > 1
            ? `${props.rowNum > props.footerRow ? 'bottom-7' : 'bottom-11'} rotate-45`
            : '-bottom-3 rotate-[-135deg]'
        } bg-white z-20 border border-t-0 border-l-0 border-gray-100 rounded-br-md`}
      />
    </div>
  );
};

export default DeltaHoverMenu;
