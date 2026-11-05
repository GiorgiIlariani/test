import { IncomeStatementEmployee } from 'types';
import { Props } from './types';
import React from 'react';
import { IncomeStatementTableRow } from 'components';
import { objectKeys } from 'helpers';

const IncomeStatementTableRowForRevenue: React.FC<Props> = (props) => {
  const currentSortingMonth = props.sortingState?.find((item) => item.current)?.index ?? 0;
  return (
    <IncomeStatementTableRow
      title={props.title}
      titleClasses='pl-7'
      currency={props.currency}
      percentageValues={props.percentageValues}
      values={props.income.map((el) => Math.round(el[props.row]?.total ?? 0))}
      negativeValues={props.negativeValues}
    >
      {props.income?.[currentSortingMonth]?.[props.row]?.projects?.map((el, i) => {
        const projectsByMonth = Array.from(Array(13), (_, month) => {
          const project = props.income[month][props.row].projects[i];
          return project;
        });

        const employeeKeys = objectKeys(el.employees);

        const employees = el.employees as {
          [key: string]: IncomeStatementEmployee;
        };

        let values = projectsByMonth.map((el) =>
          el.has_booked_term
            ? { total: Math.round(el.total ?? 0), hasBooked: el.has_booked_term }
            : Math.round(el.total ?? 0),
        ) as (number | { total: number; hasBooked: true })[];

        return (
          <IncomeStatementTableRow
            currency={props.currency}
            title={el.title}
            isBooked={projectsByMonth.some((el) => el.has_booked_term)}
            titleClasses='pl-16'
            key={el.id}
            values={values}
            percentageValues={props.percentageValues}
            negativeValues={props.negativeValues}
          >
            {employeeKeys.length >= 1 &&
              (el.employeesKeys ?? employeeKeys).map((el) => {
                const employee = employees[el];
                return (
                  <IncomeStatementTableRow
                    title={`${employee.first_name} ${employee.last_name}`}
                    currency={props.currency}
                    titleClasses='pl-22'
                    percentageValues={props.percentageValues}
                    key={el}
                    values={Array.from(Array(13), (_, i) => {
                      const projectEmployees = projectsByMonth[i].employees;
                      if (projectEmployees instanceof Array) {
                        return 0;
                      }
                      return Math.round(projectEmployees[el]?.total ?? 0);
                    })}
                    negativeValues={props.negativeValues}
                  />
                );
              })}
          </IncomeStatementTableRow>
        );
      })}
    </IncomeStatementTableRow>
  );
};

export default IncomeStatementTableRowForRevenue;
