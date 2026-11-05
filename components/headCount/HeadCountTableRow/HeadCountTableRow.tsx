import React from 'react';
import { twMerge } from 'tailwind-merge';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { ChevronLeft } from 'components/icons';
import { Props } from './Props';
import { useHeadCountTableRow } from './useHeadCountTableRow';
import { PortalWrapper } from 'components/shared';

const HeadCountTableRow: React.FC<Props> = ({
  year,
  type = 'Headcount',
  hc,
  currency = 'USD',
  period = 'monthly',
  children,
  nameClasses,
  showChevron = false,
  rowType,
}) => {
  const {
    isOpen,
    setIsOpen,
    cells,
    fullTotal,
    hovered,
    handleEnter,
    handleLeave,
    tooltipRef,
    getAverageHeadcount,
  } = useHeadCountTableRow({
    year,
    hc,
    period,
    type,
    currency,
    rowType,
  });

  return (
    <>
      {hovered && (
        <PortalWrapper>
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              top: hovered?.top ?? 0,
              left: hovered?.left ?? 0,
              transform: 'translate(-50%, -100%)',
              zIndex: 99999,
            }}
            className='w-[250px] whitespace-pre-line shadow-xs border bg-white text-slate-900 text-xs p-2 rounded-mb max-h-60 overflow-auto'
            onMouseLeave={handleLeave}
          >
            <p className='text-sm font-medium'>
              Events in {hovered.month} {year}:
            </p>
            <p
              dangerouslySetInnerHTML={{ __html: hovered.text ?? '' }}
              className='whitespace-pre-line'
              style={{ lineHeight: '1.4rem' }}
            ></p>
          </div>
        </PortalWrapper>
      )}
      <div
        className={twMerge(
          'inline-flex text-zinc-700 border-b',
          period === 'quarterly' && 'w-full',
        )}
      >
        <div
          className={twMerge(
            'w-52 inline-block text-xs sticky top-0 left-0 align-bottom h-14 bg-white z-50',
            period === 'quarterly' && 'w-[25%]',
          )}
        >
          <div className={twMerge('z-50 font-medium h-14 inline-flex pl-10 pt-4', nameClasses)}>
            <div className='flex gap-2' onClick={() => setIsOpen((prev) => !prev)}>
              {children && showChevron && (
                <div className='pt-px'>
                  <ChevronLeft
                    className={`transition-all ${isOpen ? 'rotate-90!' : 'rotate-0!'}`}
                  />
                </div>
              )}
              <p>{hc.name}</p>
            </div>
          </div>
        </div>

        <div
          className={twMerge(
            'w-[calc(100%-25.77rem)] grid grid-cols-income-month-cell',
            period === 'quarterly' && 'grid-cols-hc-quarter-cell w-[75%] justify-end',
          )}
        >
          {cells.map(({ monthKey, month, amount, tooltipText, careerChanges }) => (
            <div
              key={monthKey}
              className='px-6 pt-3'
              onMouseEnter={(e) => handleEnter(e, month, tooltipText)}
              onMouseLeave={handleLeave}
            >
              <span
                style={
                  careerChanges.length > 0
                    ? {
                        textDecoration: 'underline',
                        textDecorationColor: '#22c55e',
                        textDecorationStyle: 'dotted',
                        textUnderlineOffset: '3px',
                      }
                    : {}
                }
              >
                {type === 'Cost' && getCurrencySymbol(currency)}
                {convertNumbersAsPrice(amount)}
              </span>
            </div>
          ))}

          <div className='px-6 pt-3 border-zinc-200/60'>
            <span>
              {type === 'Cost' && getCurrencySymbol(currency)}
              {convertNumbersAsPrice(type === 'Cost' ? fullTotal : getAverageHeadcount(hc, period))}
            </span>
          </div>
        </div>
      </div>
      {isOpen && children}
    </>
  );
};

export default HeadCountTableRow;
