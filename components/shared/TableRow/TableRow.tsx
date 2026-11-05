import { can, objectKeys, truncateString } from 'helpers';
import { Props } from './types';
import React from 'react';

const TableRow: React.FC<Props> = (props) => {
  const table = { ...props.tableData };
  delete table.id;
  delete table.booked;

  const numberOfItemsChecked = props.tableHeaders?.filter((item) => item?.isChecked).length;

  return (
    <tr
      className={`cursor-pointer ${props.tableData.booked ? 'bg-gray-50' : ''} ${
        props.canHover ? 'hover:bg-zinc-100' : ''
      } border border-zinc-200  tracking-wide`}
      onClick={() =>
        can('project::update', props.permissions) && props.openRowItem?.(props.tableData)
      }
    >
      {objectKeys(table).map((td, i) =>
        props.tableHeaders[i]?.isChecked ? (
          <td
            className={`${props.classes} border-r h-[4.4rem] pl-6 text-left border-separate text-zinc-700`}
            key={i}
            title={props.tableHeaders[i].truncate ? table[td] : ''}
            onMouseEnter={() => props.externalOnMouseEnter?.(props.rowNumber)}
          >
            {props.tableHeaders[i].truncate
              ? truncateString(table[td], 65 - numberOfItemsChecked * 4)
              : table[td]}
          </td>
        ) : (
          ''
        ),
      )}
    </tr>
  );
};

export default TableRow;
