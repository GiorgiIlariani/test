import { getCookie } from 'cookies-next';
import { Currency, IncomeStatement, IncomeStatementEmployee, ParentRowData } from 'types';

export const convertAndSumIncome = (
  income: IncomeStatement[],
  currency: Currency,
  defaultCurrency: Currency,
) => {
  const clonedIncome = structuredClone(income);

  const converTedIncome = convertIncome(clonedIncome, currency, defaultCurrency);

  sumIncome(converTedIncome);

  return converTedIncome;
};

export const sumIncome = (incomeStatement: IncomeStatement[]) => {
  const sumIncome = incomeStatement[12];

  const truncatedIncome = [...incomeStatement].slice(0, -1);

  sumIncomeRowWithProjectAndEmployees(sumIncome.revenue, truncatedIncome, 'revenue', true);
  sumIncomeRowWithProjectAndEmployees(
    sumIncome.excluded_time_offs,
    truncatedIncome,
    'excluded_time_offs',
  );
  sumIncomeRowWithProjectAndEmployees(
    sumIncome.adjusted_revenue,
    truncatedIncome,
    'adjusted_revenue',
    true,
  );
  sumIncomeRowWithProjectAndEmployees(
    sumIncome.cogs_of_projects,
    truncatedIncome,
    'cogs_of_projects',
  );
  sumIncomeRowWithProjectAndEmployees(
    sumIncome.gross_profit_of_projects,
    truncatedIncome,
    'gross_profit_of_projects',
    true,
  );
  sumIncomeRowWithProjectAndEmployees(
    sumIncome.total_admin_costs.internal_project_costs,
    truncatedIncome,
    'internal_project_costs',
    true,
  );
  sumIncome.net_profit = truncatedIncome.reduce((acc, income) => {
    acc += income.net_profit;
    return acc;
  }, 0);

  sumOtherThanProjectCogs(sumIncome.other_than_project_cogs, truncatedIncome);
  sumTotalAdminCost(sumIncome.total_admin_costs, truncatedIncome);
};

const sumTotalAdminCost = (
  adminCost: IncomeStatement['total_admin_costs'],
  incomeStatement: IncomeStatement[],
) => {
  adminCost.total = incomeStatement.reduce((acc, income) => {
    acc += income.total_admin_costs.total;
    return acc;
  }, 0);
  adminCost.admin_salaries.total = incomeStatement.reduce((acc, income) => {
    acc += income.total_admin_costs.admin_salaries.total;
    return acc;
  }, 0);
  sumDepartments(adminCost.admin_salaries.departments, incomeStatement, 'admin_salaries');
  sumDepartments(adminCost.other_admin.departments, incomeStatement, 'other_admin');
  adminCost.other_admin.total = incomeStatement.reduce((acc, income) => {
    acc += income.total_admin_costs.other_admin.total;
    return acc;
  }, 0);
};

const sumDepartments = (
  departments: IncomeStatement['total_admin_costs']['admin_salaries']['departments'],
  incomeStatement: IncomeStatement[],
  field: 'admin_salaries' | 'other_admin',
) => {
  for (const key in departments) {
    const department = departments[key];
    const departmentEmployees: {
      [key: string]: {
        id: number;
        first_name: string;
        last_name: string;
        total: number;
      };
    }[] = [];
    let departmentTotal = 0;
    incomeStatement.forEach((income) => {
      const thisDepartments = income.total_admin_costs[field].departments;

      for (const key in thisDepartments) {
        // @ts-ignore
        const thisDepartment = thisDepartments[key] ?? { id: 0, total: 0, employees: {} };

        if (thisDepartment.id === department.id) {
          departmentTotal += thisDepartment?.total ?? 0;

          // @ts-ignore
          departmentEmployees.push(thisDepartment.employees);
        }
      }
    });
    department.total = departmentTotal;
    const thisDepartmentEmployees: Record<
      string,
      {
        id: number;
        first_name: string;
        last_name: string;
        total: number;
      }
    > = {};

    departmentEmployees.forEach((month) => {
      Object.values(month).forEach((employee) => {
        if (!thisDepartmentEmployees[employee.id]) {
          thisDepartmentEmployees[employee.id] = { ...employee };
        } else {
          thisDepartmentEmployees[employee.id].total += employee.total;
        }
      });
    });

    department.employees = thisDepartmentEmployees;
  }
};

const sumOtherThanProjectCogs = (
  cogs: IncomeStatement['other_than_project_cogs'],
  incomeStatement: IncomeStatement[],
) => {
  cogs.total = incomeStatement.reduce((acc, income) => {
    acc += income.other_than_project_cogs.total;
    return acc;
  }, 0);
  cogs.cost_of_bench.total = incomeStatement.reduce((acc, income) => {
    acc += income.other_than_project_cogs.cost_of_bench.total;
    return acc;
  }, 0);
  sumCogsEmployees(
    cogs.cost_of_bench.employees_fully_on_bench.employees,
    incomeStatement,
    'employees_fully_on_bench',
  );
  sumCogsEmployees(
    cogs.cost_of_bench.employees_partially_on_bench.employees,
    incomeStatement,
    'employees_partially_on_bench',
  );
  cogs.cost_of_bench.employees_fully_on_bench.total = incomeStatement.reduce((acc, income) => {
    acc += income.other_than_project_cogs.cost_of_bench.employees_fully_on_bench.total;
    return acc;
  }, 0);
  cogs.cost_of_bench.employees_partially_on_bench.total = incomeStatement.reduce((acc, income) => {
    acc += income.other_than_project_cogs.cost_of_bench.employees_partially_on_bench.total;
    return acc;
  }, 0);

  cogs.cost_of_released.total = incomeStatement.reduce((acc, income) => {
    acc += income.other_than_project_cogs.cost_of_released.total;
    return acc;
  }, 0);
  sumCogsEmployees(cogs.cost_of_released.employees, incomeStatement, 'cost_of_released');
  cogs.third_party_services.total = incomeStatement.reduce((acc, income) => {
    acc += income.other_than_project_cogs.third_party_services.total;
    return acc;
  }, 0);
  cogs.third_party_services.expenses = cogs.third_party_services.expenses.map((el) => {
    let totalPrice = 0;
    incomeStatement.forEach((income) => {
      totalPrice +=
        income.other_than_project_cogs.third_party_services.expenses.find(
          (expense) =>
            expense.other_expense_id === el.other_expense_id &&
            expense.department_id === el.department_id,
        )?.price ?? 0;
    });
    el.price = totalPrice;
    return el;
  });
};

export const sumCogsEmployees = (
  employees: IncomeStatement['revenue']['projects'][number]['employees'],
  incomeStatement: IncomeStatement[],
  incomeField: 'employees_fully_on_bench' | 'employees_partially_on_bench' | 'cost_of_released',
) => {
  if (!(employees instanceof Array)) {
    for (const key in employees) {
      const employee = employees[key];

      let employeeTotal = 0;
      incomeStatement.forEach((income) => {
        const thisIncome =
          incomeField === 'cost_of_released'
            ? income.other_than_project_cogs[incomeField]
            : income.other_than_project_cogs.cost_of_bench[incomeField];

        const thisEmployees = thisIncome.employees;

        for (const key in thisEmployees) {
          // @ts-ignore
          const thisEmployee = thisEmployees[key] ?? { id: 0, total: 0 };

          if (thisEmployee.id === employee.id) {
            employeeTotal += thisEmployee?.total ?? 0;
          }
        }
      });

      employee.total = employeeTotal;
    }
  }
};

export const sumIncomeRowWithProjectAndEmployees = (
  row: IncomeStatement['revenue'],
  incomeStatement: IncomeStatement[],
  field:
    | 'revenue'
    | 'excluded_time_offs'
    | 'adjusted_revenue'
    | 'cogs_of_projects'
    | 'gross_profit_of_projects'
    | 'internal_project_costs',
  convertTerm: boolean = false,
) => {
  row.total = incomeStatement.reduce((acc, income) => {
    acc +=
      field === 'internal_project_costs'
        ? income.total_admin_costs.internal_project_costs.total
        : income[field].total;
    return acc;
  }, 0);
  row.projects = row.projects.map((project) => {
    project.total = sumProjectField(project, incomeStatement, field, 'total');

    sumEmployeesOrTerms(project.employees, incomeStatement, field, 'employees', project);
    if (convertTerm) {
      project['T&MTotal'] = sumProjectField(project, incomeStatement, field, 'T&MTotal');
    }
    return project;
  });
};

export const sumProjectField = (
  project: IncomeStatement['revenue']['projects'][number],
  incomeStatement: IncomeStatement[],
  incomeField:
    | 'revenue'
    | 'excluded_time_offs'
    | 'adjusted_revenue'
    | 'cogs_of_projects'
    | 'gross_profit_of_projects'
    | 'internal_project_costs',
  field: 'total' | 'T&MTotal',
) => {
  let projectTotal = 0;
  incomeStatement.forEach((income) => {
    const thisProject =
      (incomeField === 'internal_project_costs'
        ? income.total_admin_costs.internal_project_costs
        : income[incomeField]
      ).projects.find((incomeProject) => incomeProject.id === project.id)?.[field] ?? 0;

    projectTotal += thisProject;
  });

  return projectTotal;
};

export const sumEmployeesOrTerms = (
  employees: IncomeStatement['revenue']['projects'][number]['employees'],
  incomeStatement: IncomeStatement[],
  incomeField:
    | 'revenue'
    | 'excluded_time_offs'
    | 'adjusted_revenue'
    | 'cogs_of_projects'
    | 'gross_profit_of_projects'
    | 'internal_project_costs',
  field: 'employees',
  project: IncomeStatement['revenue']['projects'][number],
) => {
  if (!(employees instanceof Array)) {
    for (const key in employees) {
      const employee = employees[key];

      let employeeTotal = 0;
      incomeStatement.forEach((income) => {
        const thisEmployees = (
          incomeField === 'internal_project_costs'
            ? income.total_admin_costs.internal_project_costs
            : income[incomeField]
        ).projects.find((incomeProject) => incomeProject.id === project.id)?.[field];

        for (const key in thisEmployees) {
          // @ts-ignore
          const thisEmployee = thisEmployees[key] ?? { id: 0, total: 0 };

          if (thisEmployee.id === employee.id) {
            employeeTotal += thisEmployee?.total ?? 0;
          }
        }
      });

      employee.total = employeeTotal;
    }
  }
};

export const convertIncome = (
  income: IncomeStatement[],
  currency: Currency,
  defaultCurrency: Currency,
) => {
  return income.map((el, index, array) => {
    if (index === array.length - 1) return el;
    const rate = el.rates[currency];
    const divide = defaultCurrency === 'GEL';
    convertIncomeRowWithProjectAndEmployees(el.revenue, divide, rate, true);
    convertIncomeRowWithProjectAndEmployees(el.excluded_time_offs, divide, rate);
    convertIncomeRowWithProjectAndEmployees(el.adjusted_revenue, divide, rate, true);
    convertIncomeRowWithProjectAndEmployees(el.cogs_of_projects, divide, rate);
    convertIncomeRowWithProjectAndEmployees(el.gross_profit_of_projects, divide, rate);
    convertIncomeRowWithProjectAndEmployees(
      el.total_admin_costs.internal_project_costs,
      divide,
      rate,
    );
    el.net_profit = convertNumber(el.net_profit, rate, true);
    convertOtherThanProjectCogs(el.other_than_project_cogs, rate, divide);
    convertTotalAdminCost(el.total_admin_costs, rate, divide);
    return el;
  });
};

export const convertTotalAdminCost = (
  adminCost: IncomeStatement['total_admin_costs'],
  usdRate: number,
  divide: boolean,
) => {
  adminCost.total = convertNumber(adminCost.total, usdRate, divide);
  adminCost.admin_salaries.total = convertNumber(adminCost.admin_salaries.total, usdRate, divide);
  convertDepartments(adminCost.admin_salaries.departments, usdRate, divide);
  convertDepartments(adminCost.other_admin.departments, usdRate, divide);
  adminCost.other_admin.total = convertNumber(adminCost.other_admin.total, usdRate, divide);
};

const convertIncomeRowWithProjectAndEmployees = (
  row: IncomeStatement['revenue'],
  divide: boolean,
  usdRate: number,
  convertTerm: boolean = false,
) => {
  row.total = convertNumber(row.total, usdRate, divide);
  row.projects = row.projects.map((project) => {
    project.total = convertNumber(project.total, usdRate, divide);
    convertEmployeesOrTerms(project.employees, usdRate, divide);
    if (convertTerm) {
      project['T&MTotal'] = convertNumber(project['T&MTotal'], usdRate, divide);
    }
    return project;
  });
};

const convertDepartments = (
  departments: IncomeStatement['total_admin_costs']['admin_salaries']['departments'],
  usdRate: number,
  divide: boolean,
) => {
  for (const key in departments) {
    const department = departments[key];
    department.total = convertNumber(department.total, usdRate, divide);
    convertEmployeesOrTerms(department.employees, usdRate, divide);
  }
};

export const convertEmployeesOrTerms = (
  employees: IncomeStatement['revenue']['projects'][number]['employees'],
  usdRate: number,
  divide: boolean,
) => {
  if (!(employees instanceof Array)) {
    for (const key in employees) {
      const employee = employees[key];
      employee.total = convertNumber(employee.total, usdRate, divide);
    }
  }
};

const convertOtherThanProjectCogs = (
  cogs: IncomeStatement['other_than_project_cogs'],
  usdRate: number,
  divide: boolean,
) => {
  cogs.total = convertNumber(cogs.total, usdRate, divide);
  cogs.cost_of_bench.total = convertNumber(cogs.cost_of_bench.total, usdRate, divide);
  convertEmployeesOrTerms(cogs.cost_of_bench.employees_fully_on_bench.employees, usdRate, divide);
  convertEmployeesOrTerms(
    cogs.cost_of_bench.employees_partially_on_bench.employees,
    usdRate,
    divide,
  );
  cogs.cost_of_bench.employees_fully_on_bench.total = convertNumber(
    cogs.cost_of_bench.employees_fully_on_bench.total,
    usdRate,
    divide,
  );
  cogs.cost_of_bench.employees_partially_on_bench.total = convertNumber(
    cogs.cost_of_bench.employees_partially_on_bench.total,
    usdRate,
    divide,
  );

  cogs.cost_of_released.total = convertNumber(cogs.cost_of_released.total, usdRate, divide);
  convertEmployeesOrTerms(cogs.cost_of_released.employees, usdRate, divide);
  cogs.third_party_services.total = convertNumber(cogs.third_party_services.total, usdRate, divide);
  cogs.third_party_services.expenses = cogs.third_party_services.expenses.map((el) => {
    el.price = convertNumber(el.price, usdRate, divide);
    return el;
  });
};

const convertNumber = (number: number, rate: number, divide: boolean) => {
  if (divide) {
    return number / rate;
  }
  return number * rate;
};

export const parentRowDefaultSort: ParentRowData[] = [
  { row: 'revenue', title: 'Revenue', detailHeaderZIndex: 12 },
  {
    row: 'excluded_time_offs',
    title: 'Excluded time offs',
    detailHeaderZIndex: 13,
    negativeValues: true,
  },
  { row: 'adjusted_revenue', title: 'Adjusted revenue', detailHeaderZIndex: 14 },
  { row: 'cogs_of_projects', title: 'Cogs of project', detailHeaderZIndex: 15 },
  {
    row: 'gross_profit_of_projects',
    title: 'Gross profit (pure projects)',
    detailHeaderZIndex: 16,
  },
  {
    row: 'gross_margin_of_projects',
    title: 'Gross margin (pure projects)',
    detailHeaderZIndex: 17,
    percentageValues: true,
  },
  { row: 'other_than_project_cogs' },
  { row: 'total_admin_costs' },
];

export const createSortedArrayFromObject = (
  obj: Record<string, IncomeStatementEmployee>,
  sortBy: 'asc' | 'desc' | '',
) => {
  const sortableArray = Object.entries(obj);
  sortableArray.sort(([, valueA], [, valueB]) =>
    sortBy === 'asc' ? +valueA.total - +valueB.total : +valueB.total - +valueA.total,
  );

  return sortableArray.map((item) => item[0]);
};

export const getUser = async () => {
  if (getCookie('token')) {
    try {
      const usersCookie = getCookie('end-user');
      const user = await JSON.parse(usersCookie as string);
      return user;
    } catch (_) {}
  }
};
