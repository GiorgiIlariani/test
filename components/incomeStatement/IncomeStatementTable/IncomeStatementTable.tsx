import { INCOME_HEADERS } from 'config';
import React from 'react';
import {
  IncomeStatementTableRow,
  IncomeStatementTableRowWithProjectEmployeeDetails,
  IncomeStatementInputs,
  IncomeStatementTableRowWithTwoTitles,
  IncomeStatementEmployeeRow,
  IncomeStatementTableLoader,
} from 'components';
import { Props } from './types';
import { calculateOtherThanProjectCogsSum, totalCogs, totalGrossProfitSum } from './helpers';
import { SortingState } from 'types';
import { IncomeStatementTableRowForRevenue } from '../IncomeStatementTableRowForRevenue';

const IncomeStatementTable: React.FC<Props> = (props) => {
  return (
    <div className='rounded-md grow overflow-hidden'>
      <div className='overflow-auto h-full'>
        <div className='w-[25.77rem] inline-block sticky top-0 z-30 left-0 align-bottom rounded-tl-md border-r-0 border border-zinc-200 h-14 bg-indigo-50'></div>
        <div className='w-[calc(100%-25.77rem)] sticky top-0 z-10 h-14 align-bottom text-indigo-900 text-xs inline-grid grid-cols-income-month-cell'>
          {INCOME_HEADERS.map((el, i) => (
            <div
              className={`${
                props.sortingState[i]?.sortedBy === 'desc' ? 'font-bold!' : ''
              } z-10 cursor-pointer items-center font-medium border-gray-250 border-y bg-indigo-50 ${
                i < 12 ? 'px-6' : 'pl-12'
              } h-14 inline-flex border-l  border-zinc-200 ${
                i == 12 && 'border-r border-zinc-200'
              }`}
              key={el}
              onClick={() => props.sortIncomeStatement(i)}
            >
              {el}{' '}
              {i < 12 && props.currency !== props.originalCurrency && (
                <>
                  {' ('}
                  {props.loading ? (
                    <div className='text-gray-300 h-3 w-6 bg-gray-300 animate-pulse'></div>
                  ) : (
                    props.income[i]?.rates?.[props.currency]
                  )}
                  {')'}
                </>
              )}
            </div>
          ))}
        </div>
        {props.loading ? (
          <IncomeStatementTableLoader isOtherAdmin={false} mainTableLoader={true} itemNumber={12} />
        ) : (
          <>
            <IncomeStatementTableRowForRevenue
              currency={props.currency}
              income={props.income}
              row='revenue'
              title='Gross revenue'
              detailHeaderZIndex={12}
              sortingState={props.sortingState as SortingState}
            />

            <IncomeStatementTableRowWithProjectEmployeeDetails
              currency={props.currency}
              income={props.income}
              row='excluded_time_offs'
              title='Excluded time offs'
              detailHeaderZIndex={13}
              negativeValues={true}
              sortingState={props.sortingState as SortingState}
            />

            <IncomeStatementTableRowForRevenue
              currency={props.currency}
              income={props.income}
              row='adjusted_revenue'
              title='Revenue'
              sortingState={props.sortingState as SortingState}
              detailHeaderZIndex={14}
            />

            <IncomeStatementTableRowWithProjectEmployeeDetails
              currency={props.currency}
              income={props.income}
              row='cogs_of_projects'
              title='Cogs of project'
              detailHeaderZIndex={15}
              sortingState={props.sortingState as SortingState}
            />

            <IncomeStatementTableRowWithProjectEmployeeDetails
              currency={props.currency}
              income={props.income}
              row='gross_profit_of_projects'
              title='Gross profit (pure projects)'
              detailHeaderZIndex={16}
              sortingState={props.sortingState as SortingState}
            />

            <IncomeStatementTableRowWithProjectEmployeeDetails
              currency={props.currency}
              income={props.income}
              row='gross_margin_of_projects'
              title='Gross margin (pure projects)'
              detailHeaderZIndex={17}
              percentageValues={true}
              sortingState={props.sortingState as SortingState}
            />

            <IncomeStatementTableRow
              title='OTHER THAN PROJECT COGS'
              titleClasses='pl-7'
              currency={props.currency}
              values={calculateOtherThanProjectCogsSum(props.income)}
            >
              <IncomeStatementTableRow
                title='COST OF BENCH'
                titleClasses='pl-16'
                currency={props.currency}
                values={props.income?.map(
                  (item) => item.other_than_project_cogs?.cost_of_bench?.total,
                )}
              >
                <IncomeStatementEmployeeRow
                  currency={props.currency}
                  income={props.income}
                  title={'Fully non-utilized bench'}
                  totalValues={props.income?.map(
                    (item) =>
                      item.other_than_project_cogs?.cost_of_bench?.employees_fully_on_bench?.total,
                  )}
                  sortingState={props.sortingState as SortingState}
                  titleClasses='pl-18!'
                  detailHeaderZIndex={0}
                  otherThanProject='cost_of_bench'
                  costOfBenchNest={'employees_fully_on_bench'}
                />
                <IncomeStatementEmployeeRow
                  currency={props.currency}
                  income={props.income}
                  title={'Partially utilized bench'}
                  totalValues={props.income?.map(
                    (item) =>
                      item.other_than_project_cogs?.cost_of_bench?.employees_partially_on_bench
                        ?.total,
                  )}
                  sortingState={props.sortingState as SortingState}
                  titleClasses='pl-18!'
                  detailHeaderZIndex={0}
                  otherThanProject='cost_of_bench'
                  costOfBenchNest={'employees_partially_on_bench'}
                />
              </IncomeStatementTableRow>
              <IncomeStatementEmployeeRow
                currency={props.currency}
                income={props.income}
                title={'COMPENSATION COST'}
                row={'total_admin_costs'}
                titleClasses='pl-16!'
                detailHeaderZIndex={0}
                otherThanProject='cost_of_released'
                totalValues={props.income?.map(
                  (item) => item.other_than_project_cogs?.cost_of_released?.total,
                )}
                sortingState={props.sortingState as SortingState}
              />

              <IncomeStatementTableRow
                title='COST OF THIRD PARTY SERVICES'
                titleClasses='pl-16'
                currency={props.currency}
                values={props.income?.map((el) =>
                  Math.round(el.other_than_project_cogs.third_party_services?.total),
                )}
              >
                <IncomeStatementInputs
                  income={props.income}
                  currency={props.currency}
                  setIncome={props.setIncome}
                  year={props.year}
                  departments={props.departments}
                  setOriginalIncome={props.setOriginalIncome}
                  originalCurrency={props.originalCurrency}
                />
              </IncomeStatementTableRow>
            </IncomeStatementTableRow>

            <IncomeStatementTableRow
              title='TOTAL COGS'
              titleClasses='pl-7'
              currency={props.currency}
              values={totalCogs(props.income)}
            />
            <IncomeStatementTableRow
              title='GROSS PROFIT'
              titleClasses='pl-7'
              currency={props.currency}
              values={totalGrossProfitSum(props.income)}
            />
            <IncomeStatementTableRow
              title='TOTAL ADMIN COSTS'
              titleClasses='pl-7'
              currency={props.currency}
              values={props.income?.map(
                (el) =>
                  Math.round(el.total_admin_costs.admin_salaries.total) +
                  Math.round(el.total_admin_costs.other_admin.total) +
                  Math.round(el.total_admin_costs.internal_project_costs.total),
              )}
            >
              <IncomeStatementTableRowWithTwoTitles
                currency={'USD'}
                income={props.income}
                title={'ADMIN SALARIES'}
                row={'total_admin_costs'}
                titleClasses='pl-16!'
                detailHeaderZIndex={0}
                departments={props.departments}
              />
              <IncomeStatementTableRow
                title='OTHER ADMINS'
                titleClasses='pl-16'
                currency={props.currency}
                values={props.income?.map((el) =>
                  Math.round(el.total_admin_costs.other_admin.total),
                )}
              >
                <IncomeStatementInputs
                  income={props.income}
                  isOtherAdmin={true}
                  currency={props.currency}
                  originalCurrency={props.originalCurrency}
                  setIncome={props.setIncome}
                  year={props.year}
                  departments={props.departments}
                  setOriginalIncome={props.setOriginalIncome}
                />
              </IncomeStatementTableRow>
              <IncomeStatementTableRowWithProjectEmployeeDetails
                currency={props.currency}
                titleClasses='pl-16'
                income={props.income}
                row='internal_project_costs'
                title='INTERNAL PROJECT COGS'
                detailHeaderZIndex={15}
                sortingState={props.sortingState as SortingState}
              />
            </IncomeStatementTableRow>

            <IncomeStatementTableRow
              title='EBITDA'
              titleClasses='pl-7'
              currency={props.currency}
              values={props.income?.map((el) => Math.round(el.net_profit))}
            />

            <IncomeStatementTableRow
              title='EBITDA MARGIN %'
              titleClasses='pl-7'
              currency={props.currency}
              percentageValues={true}
              values={props.income?.map((el) => Math.round(el.net_profit_margin))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default IncomeStatementTable;
