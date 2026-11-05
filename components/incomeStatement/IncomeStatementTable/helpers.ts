import { IncomeStatement } from 'types';

export const calculateOtherThanProjectCogsSum = (income: IncomeStatement[]) => {
  return income?.map(
    (el) =>
      Math.round(el.other_than_project_cogs.cost_of_bench.total) +
      Math.round(el.other_than_project_cogs.third_party_services.total) +
      Math.round(el.other_than_project_cogs.cost_of_released.total),
  );
};

const otherThanProjectCogsTrueNumbers = (income: IncomeStatement[]) => {
  return income?.map(
    (el) =>
      el.other_than_project_cogs.cost_of_bench.total +
      el.other_than_project_cogs.cost_of_released.total +
      el.other_than_project_cogs.third_party_services.total,
  );
};

const calculateCogsOfProjectSum = (income: IncomeStatement[]) => {
  return income.map((el) => el['cogs_of_projects'].total ?? 0);
};

const calculateAdjustedRevenueSum = (income: IncomeStatement[]) => {
  return income.map((el) => el['adjusted_revenue'].total ?? 0);
};

export const totalCogs = (income: IncomeStatement[]) => {
  return otherThanProjectCogsTrueNumbers(income).map((item, i) =>
    Math.round(item + calculateCogsOfProjectSum(income)[i]),
  );
};

const trueTotalCogs = (income: IncomeStatement[]) => {
  return otherThanProjectCogsTrueNumbers(income).map(
    (item, i) => item + calculateCogsOfProjectSum(income)[i],
  );
};

export const totalGrossProfitSum = (income: IncomeStatement[]) => {
  return calculateAdjustedRevenueSum(income).map((el, i) =>
    Math.round(el - trueTotalCogs(income)[i]),
  );
};
