import { twMerge } from 'tailwind-merge';
import { Props } from './types';
import { useTableWrapper } from './useTableWrapper';
import { ElementEqual, FilterIcon, FilterTableColumns, TableRow } from 'components';

const TableWrapper: React.FC<Props> = (props) => {
  const {
    isOpen,
    optionsChangeHandler,
    dropdownToggler,
    buttonRef,
    dropdownRef,
    tableHeaders,
    resetCoordinates,
    getElementPosition,
    top,
    left,
    hoverText,
  } = useTableWrapper(props.tableHeaders, props.tableType);

  return (
    <div className={`${props.allowHorizontalScroll ? 'overflow-x-scroll' : ''}  group`}>
      <div className={`${props.tableWrapperClasses} w-full max-h-96 rounded-md border`}>
        <table className='w-full border pb-36'>
          <thead className={twMerge('-top-[2px] z-30!', !!!props.removeStickyHeader && 'sticky')}>
            <tr className='border-b border-gray-600 pt-4 bg-indigo-50 tracking-wide text-indigo-900 text-xs'>
              {tableHeaders?.map((tableHead) => {
                if (tableHead.isChecked) {
                  return (
                    <th className='border pl-6 py-4 px-2 text-left' key={tableHead.title}>
                      {props.isTableLoading ? (
                        <div className='bg-gray-300 animate-pulse border-gray-100 h-4 rounded-md ' />
                      ) : (
                        <p className='font-medium '>{tableHead.title}</p>
                      )}
                    </th>
                  );
                } else {
                  return null;
                }
              })}
            </tr>
          </thead>
          <tbody className='border-zinc-200 border'>
            {props.isTableLoading
              ? Array.from(Array(props.loadingRows ?? 5).keys()).map((item) => (
                  <tr key={item} className={`cursor-pointer border border-zinc-200  tracking-wide`}>
                    {tableHeaders?.map((tableHead) => {
                      if (tableHead.isChecked) {
                        return (
                          <th className='border pl-6 py-6 px-2 text-left' key={tableHead.title}>
                            <div className='bg-gray-300 animate-pulse border-gray-100 h-4 rounded-md' />
                          </th>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </tr>
                ))
              : props.tableData.map((item, i) => (
                  <TableRow
                    key={i}
                    tableData={item}
                    classes={item.classes}
                    tableHeaders={tableHeaders}
                    openRowItem={props.openRowItem}
                    isLoading={props.isTableLoading}
                    canHover={props.canHover}
                    externalOnMouseEnter={props.externalOnMouseEnter}
                    rowNumber={i}
                    permissions={props.permissions}
                  />
                ))}

            {isOpen && (
              <FilterTableColumns
                buttonRef={buttonRef}
                dropdownRef={dropdownRef}
                isOpen={isOpen}
                dropdownToggler={dropdownToggler}
                optionsChangeHandler={optionsChangeHandler}
                list={tableHeaders}
              />
            )}
          </tbody>
          {!props.hideFooter ? (
            <tfoot>
              {props.externalFooter ?? (
                <tr className='border-b -bottom-[2px] shadow-inner sticky bg-white border-gray-600 tracking-wide text-zinc-400 text-sm'>
                  {tableHeaders?.map((tableHead, i) =>
                    tableHead.isChecked ? (
                      <td
                        ref={props.elementsRef?.current[i]}
                        className=' border pl-6 p-2 text-left cursor-pointer'
                        key={tableHead.id}
                        onMouseEnter={() =>
                          getElementPosition(
                            props.elementsRef?.current[i]!,
                            props.tableFooters?.[i].hover!,
                          )
                        }
                        onMouseLeave={() => resetCoordinates()}
                      >
                        {props.isTableLoading ? (
                          <div className='bg-gray-300 animate-pulse border-gray-100 h-4 rounded-md' />
                        ) : (
                          <p>{props.tableFooters?.[i].title}</p>
                        )}
                        <div
                          className={`${
                            hoverText ? 'flex' : 'hidden'
                          } fixed pointer-events-none text-white bg-zinc-700 text-xs z-999999999999  rounded-[38px] px-2 py-1`}
                          style={{
                            top: top,
                            left: left,
                          }}
                        >
                          {hoverText}
                        </div>
                      </td>
                    ) : (
                      ''
                    ),
                  )}
                </tr>
              )}
            </tfoot>
          ) : (
            ''
          )}
        </table>
      </div>
      {props.allowFilterRows && (
        <div className={`${isOpen ? 'flex' : 'hidden'} group-hover:flex`}>
          {!isOpen ? (
            <button
              className={`${props.filterIconStyles} absolute top-[0.6rem] right-4 z-60`}
              ref={buttonRef}
              type='button'
              onClick={dropdownToggler}
            >
              <FilterIcon />
            </button>
          ) : (
            <button
              className={`${props.filterIconStyles} absolute top-[0.6rem] right-4 z-60`}
              ref={buttonRef}
              type='button'
              onClick={dropdownToggler}
            >
              <ElementEqual />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableWrapper;
