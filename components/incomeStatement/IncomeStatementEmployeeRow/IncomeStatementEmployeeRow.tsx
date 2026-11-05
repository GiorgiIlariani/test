import { Props } from './types';
import React from 'react';
import { IncomeStatementTableRow } from 'components';
import { IncomeStatementEmployee } from 'types';
import { useIncomeStatementEmployeeRow } from './useIncomeStatementEmployeeRow';
import { twMerge } from 'tailwind-merge';

const IncomeStatementEmployeeRow: React.FC<Props> = (props) => {
  const { employeeData } = useIncomeStatementEmployeeRow(
    props.income,
    props.costOfBenchNest,
    props.sortingState,
  );

  return (
    <IncomeStatementTableRow
      title={props.title}
      titleClasses={`${props.titleClasses} pl-7`}
      currency={props.currency}
      percentageValues={props.percentageValues}
      values={props.totalValues}
    >
      {employeeData(props.otherThanProject).employeeKeys?.[0] &&
        employeeData(props.otherThanProject).employeeKeys.map((el) => {
          const employee = employeeData(props.otherThanProject).employees[el];

          return (
            <React.Fragment key={el}>
              <IncomeStatementTableRow
                currency={props.currency}
                values={Array.from(Array(13).keys()).map((month) => {
                  let employeeData;
                  if (!!props.costOfBenchNest) {
                    employeeData = props.income?.[month]?.other_than_project_cogs[
                      props.otherThanProject as 'cost_of_bench'
                    ][props.costOfBenchNest].employees as {
                      [key: string]: IncomeStatementEmployee;
                    };
                  } else {
                    employeeData = props.income?.[month]?.other_than_project_cogs[
                      props.otherThanProject as 'cost_of_released'
                    ].employees as {
                      [key: string]: IncomeStatementEmployee;
                    };
                  }

                  const employeeTotal = employeeData?.[employee.id.toString()]?.total ?? 0;
                  return employeeTotal;
                })}
                removeBorderY={true}
                titleClasses={twMerge('py-0! gap-x-0! pl-16!', !!props.costOfBenchNest && 'pl-24!')}
                title={`${employee?.first_name} ${employee?.last_name}`}
              />
            </React.Fragment>
          );
        })}
    </IncomeStatementTableRow>
  );
};

export default IncomeStatementEmployeeRow;
