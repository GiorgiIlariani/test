import { Props } from './types';
import React from 'react';
import { convertNumbersAsPrice } from 'helpers';

const TimeSheetTableFooter: React.FC<Props> = (props) => {
  return (
    <>
      {props.footerData.map((footRow, index) => {
        const bottomPosition = () => {
          switch (index) {
            case 0:
              return 60;
            case 1:
              return 28;
            case 2:
              return -2;
          }
        };
        return (
          <tr
            key={index}
            className={`border-b  bg-white border-gray-600 tracking-wide text-zinc-400 text-sm`}
            style={{ position: 'sticky', bottom: bottomPosition() }}
          >
            {props.headers.map((item, i) => {
              const marginColumn =
                index === 2 && Number(props.footerData?.[index][i]?.toString()?.split('(')[0]) !== 0
                  ? `${
                      props.footerData?.[index][i]?.toString()?.split('(')[0]?.startsWith('-')
                        ? `-$${props.footerData?.[index][i].toString().slice(1)}`
                        : `+$${props.footerData?.[index][i]}`
                    }`
                  : `$${props.footerData?.[index][i]}`;

              const emptyColumn = '';
              const numberColumn = `${
                index === 2 && Number(props.footerData?.[index][i]?.toString()?.split('(')[0]) !== 0
                  ? Number(props.footerData?.[index][i]?.toString()?.split('(')[0]) < 0
                    ? '-'
                    : '+'
                  : ''
              } $${convertNumbersAsPrice(
                index === 2
                  ? Math.abs(+props.footerData?.[index][i])
                  : +props.footerData?.[index][i],
              )}`;
              const hourColumn = props.footerData?.[index][i];

              let columnType;

              switch (true) {
                case i === 5:
                  columnType = marginColumn;
                  break;
                case i === 2 || i === 0:
                  columnType = hourColumn;
                  break;
                case i === 1 || i === props.headers?.length - 1:
                  columnType = emptyColumn;
                  break;
                default:
                  columnType = numberColumn;
                  break;
              }

              return (
                <td className=' border pl-6 p-2 text-left cursor-pointer' key={i}>
                  {props.isTableLoading ? (
                    <div className={`bg-gray-300 animate-pulse border-gray-100 h-4 rounded-md`} />
                  ) : (
                    <p
                      className={`${i === 0 ? 'text-zinc-700' : ''} ${
                        Number(props.footerData?.[index][i]?.toString()?.split('(')[0]) === 0
                          ? 'text-zinc-400'
                          : ''
                      } ${
                        i > 2 && index === 2
                          ? props.footerData?.[index][i]?.toString()?.split('(')[0]?.startsWith('-')
                            ? 'text-redberry-red'
                            : 'text-[#059669]'
                          : ''
                      }`}
                    >
                      {columnType}
                    </p>
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};
export default TimeSheetTableFooter;
