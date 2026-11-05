import { Props } from './types';
import React from 'react';
import { IncomeStatementTableRow } from 'components';
import { objectKeys } from 'helpers';
import { IncomeStatementEmployee } from 'types';
import { useIncomeStatementTableRowWithTwoTitles } from './useIncomeStatementTableRowWithTwoTitles';

const IncomeStatementTableRowWithTwoTitles: React.FC<Props> = (props) => {
  const { employeeData } = useIncomeStatementTableRowWithTwoTitles(props.income);

  return (
    <IncomeStatementTableRow
      title={props.title}
      titleClasses={`${props.titleClasses} pl-7`}
      currency={props.currency}
      percentageValues={props.percentageValues}
      values={props.income.map((el) => el[props.row as 'total_admin_costs']?.admin_salaries.total)}
    >
      {props.departments.map((department) => {
        if (employeeData(department.id).employeeKeys.length > 1) {
          return objectKeys(employeeData(department.id).uniqueEmployees).map((el, i) => {
            const employee = employeeData(department.id).uniqueEmployees[el];

            return (
              <React.Fragment key={el}>
                <IncomeStatementTableRow
                  currency={props.currency}
                  isDoubleTitle={true}
                  values={Array.from(Array(13).keys()).map((month) => {
                    const employeeData = props.income?.[month]?.total_admin_costs?.admin_salaries
                      ?.departments[department.id]?.employees as {
                      [key: string]: IncomeStatementEmployee;
                    };

                    const employeeTotal = employeeData?.[employee.id.toString()]?.total ?? 0;
                    return employeeTotal;
                  })}
                  removeBorderY={true}
                  titleClasses='py-0! gap-x-0!'
                  doubleFirstCol={i === 0 ? department.title : ''}
                  doubleSecondCol={`${employee?.first_name} ${employee?.last_name}`}
                />
              </React.Fragment>
            );
          });
        }

        return null;
      })}
    </IncomeStatementTableRow>
  );
};

export default IncomeStatementTableRowWithTwoTitles;
