'use client';

import { getCookie } from 'cookies-next';
import { objectKeys, toastGeneralError } from 'helpers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  createOtherExpenseEntry,
  deleteExpenseRecord,
  deleteExpenseRow,
  getOtherAdminExpenses,
  getOtherExpansesTitles,
  getOtherExpenses,
  updateOtherExpenseTitle,
} from 'services';
import {
  Currency,
  Department,
  IncomeStatement,
  IncomeStatementInputs,
  IncomeStatementInputsItem,
  ListItem,
  MonthsType,
  OtherExpense,
  OtherExpenseResponse,
  SetState,
} from 'types';
import { convertNumber, convertNumberFromUnrelatedCurrencies, months } from './helpers';
import { toFixedWithoutZeros } from '../EditableIncomeStatementInput/helpers';
import { useRouter } from 'next/router';

export const useIncomeStatementInputs = (
  setIncome: SetState<IncomeStatement[]>,
  setOriginalIncome: SetState<IncomeStatement[]>,
  isOtherAdmin: boolean | undefined,
  income: IncomeStatement[],
  currency: Currency,
  year: number,
  departments: Department[],
  originalCurrency: Currency,
) => {
  const [otherExpenses, setOtherExpenses] = useState<OtherExpenseResponse[]>([]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [list, setList] = useState<ListItem[]>([]);
  const [initialList, setInitialList] = useState<ListItem[]>([]);
  const [departmentList, setDepartmentList] = useState<ListItem[]>([]);
  const [departmentInitialList, setDepartmentInitialList] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [otherExpenseTitles, setOtherExpenseTitles] = useState<ListItem[]>([]);
  const [isNumberAdded, setIsNumberAdded] = useState(false);
  const [recordsSaving, setRecordsSaving] = useState(false);

  const form = useForm<{ third_party_services: IncomeStatementInputs[] }>({
    defaultValues: {
      third_party_services: otherExpenses.map((expense) => ({
        id: expense.id,
        name: expense.title,
      })),
    },
  });

  const router = useRouter();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'third_party_services',
  });

  const getOtherExpensesTitlesHandler = async () => {
    try {
      const response = await getOtherExpansesTitles(getCookie('token'));
      setOtherExpenseTitles(response.data);
      return response.data ?? [];
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const getOtherExpenseHandler = async () => {
    try {
      const response = isOtherAdmin
        ? await getOtherAdminExpenses(getCookie('token'), year)
        : await getOtherExpenses(getCookie('token'), year);
      setOtherExpenses(response);
      return response;
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const prevCurrency = useRef(currency);

  useEffect(() => {
    const thirdPartServices = form.getValues('third_party_services');
    let sum = 0;
    thirdPartServices.map((el, i) => {
      objectKeys(el).map((key) => {
        if (+key) {
          const converted = convertNumberFromUnrelatedCurrencies(
            el[key as keyof IncomeStatementInputs & number].price_without_formatting ?? 0,
            income[+key - 1]?.rates?.[prevCurrency.current],
            income[+key - 1]?.rates?.[currency],
            originalCurrency === 'GEL',
          );

          let last = key === 13;

          if (!last) {
            sum += converted;
          }

          form.setValue(
            // @ts-ignore
            `third_party_services.${i}.${key}.price`,
            toFixedWithoutZeros((last ? sum : converted).toString(), 1),
          );
          form.setValue(
            // @ts-ignore
            `third_party_services.${i}.${key}.price_without_formatting`,
            last ? sum : converted,
          );
        }
      });
    });
    prevCurrency.current = currency;
  }, [currency, year]);

  const setOtherExpenseValues = useCallback(async () => {
    try {
      const otherExpenses = await getOtherExpenseHandler();
      const otherExpenseIds = otherExpenses?.map((item) => item.id);

      setDepartmentList(departments);
      setDepartmentInitialList(departments);

      const otherExpenseTitles = await getOtherExpensesTitlesHandler();

      if (!isOtherAdmin) {
        const filteredTitles = otherExpenseTitles?.filter(
          (item) => !otherExpenseIds?.includes(item.id),
        ) as ListItem[];
        setList(filteredTitles);
        setInitialList(filteredTitles);
      } else {
        setList(otherExpenseTitles ?? []);
        setInitialList(otherExpenseTitles ?? []);
      }

      let formattedExpenses: IncomeStatementInputs[] = [];

      otherExpenses?.forEach((expense) => {
        expense.records.forEach((item, i) => {
          const converted = convertNumber(
            item.price ?? 0,
            income[item.month - 1]?.rates?.[currency],
            originalCurrency === 'GEL',
          );
          const existingRecords = expense.records
            .slice(0, i)
            .some(
              (rec) =>
                rec.department_id === item.department_id &&
                rec.other_expense_id === item.other_expense_id,
            );

          if (existingRecords) {
            const existingEntry = formattedExpenses.find(
              (entry) => entry.id === expense.id && entry.department_id === item.department_id,
            );

            if (existingEntry) {
              existingEntry[item.month as keyof IncomeStatementInputs & number] = {
                price: converted,
                id: item.id,
                price_without_formatting: converted,
              };
            }
          } else {
            const newEntry = {
              name: expense.title,
              id: expense.id,
              department: departments.find((dep) => dep.id === item.department_id)?.title,
              department_id: item.department_id || null,
              [item.month]: {
                price: toFixedWithoutZeros(converted.toString(), 1),
                id: item.id,
                price_without_formatting: converted,
              },
            };
            formattedExpenses.push(newEntry as unknown as IncomeStatementInputs);
          }
        });
      });

      formattedExpenses = formattedExpenses.map((expense) => {
        let price = 0;
        let price_without_formatting = 0;
        objectKeys(expense).map((key) => {
          if (+key) {
            price += Number((expense[key] as IncomeStatementInputsItem).price!);
            price_without_formatting += Number(
              (expense[key] as IncomeStatementInputsItem).price_without_formatting!,
            );
          }
        });
        return {
          ...expense,
          13: { id: null, price, price_without_formatting },
        };
      });

      form.reset({ third_party_services: formattedExpenses });

      setIsLoading(false);
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  }, [departments, form, isOtherAdmin]);

  useEffect(() => {
    setOtherExpenseValues();
  }, [isOtherAdmin]);

  const calculateTotalPrice = (
    data: OtherExpenseResponse[],
    month: number,
    originalCurrency?: Currency,
    rate?: number,
  ) => {
    var totalPrice = 0;

    data.forEach((obj) => {
      obj.records.forEach((record) => {
        if (record.month === +month) {
          const convertedPrice =
            rate && originalCurrency
              ? convertNumber(record.price, rate, originalCurrency === 'GEL')
              : record.price;
          totalPrice += convertedPrice;
        }
      });
    });

    return totalPrice;
  };

  const saveExpenseRecord = async (
    inputName: `third_party_services.${number}`,
    value: { price: number; id: number },
    month: number,
    previousValue: { price: number; id: number },
  ) => {
    try {
      setRecordsSaving(true);
      setIsNumberAdded((prev) => !prev);

      const otherExpenseId = form.getValues(inputName)!.id;
      const departmentId = form.getValues(inputName)!.department_id as number;
      const price = value.price;
      const id = value.id;

      const data: OtherExpense = {
        other_expense_id: +otherExpenseId!,
        department_id: departmentId || null,
        price: +price,
        month: +month,
        year: year,
      };
      if (currency !== originalCurrency) {
        data.price = convertNumber(
          data.price,
          income[month - 1].rates?.[currency],
          originalCurrency !== 'GEL',
        );
      }

      const response = id
        ? await updateOtherExpenseTitle(getCookie('token'), data, id)
        : await createOtherExpenseEntry(getCookie('token'), data);

      //@ts-ignore
      form.setValue(`${inputName}.${month}`, {
        id: response.data?.id,
        price: value.price,
        price_without_formatting: value.price,
      });

      //@ts-ignore
      let totalValue: IncomeStatementInputsItem = form.getValues(`${inputName}.13`);

      //@ts-ignore
      form.setValue(`${inputName}.13`, {
        id: null,
        price: (Number(totalValue?.price)! ?? 0) + (+value.price - (previousValue?.price ?? 0)),
        price_without_formatting:
          (Number(totalValue?.price_without_formatting)! ?? 0) +
          (+value.price - (previousValue?.price ?? 0)),
      });

      const otherExpenses = await getOtherExpenseHandler();

      if (isOtherAdmin) {
        setIncome((prev) => {
          const newState = [...prev];
          const sumOfPrice = calculateTotalPrice(
            otherExpenses as OtherExpenseResponse[],
            month,
            originalCurrency,
            newState[+month - 1].rates?.[currency],
          );

          let difference = +sumOfPrice - +newState[+month - 1].total_admin_costs.other_admin.total;
          newState[+month - 1].total_admin_costs.other_admin.total = sumOfPrice;
          newState[12].total_admin_costs.other_admin.total =
            (Number(newState[12].total_admin_costs.other_admin.total) ?? 0) + difference;

          return newState;
        });
        setOriginalIncome((prev) => {
          const newState = [...prev];
          const sumOfPrice = calculateTotalPrice(otherExpenses as OtherExpenseResponse[], month);
          let difference = +sumOfPrice - +newState[+month - 1].total_admin_costs.other_admin.total;
          newState[+month - 1].total_admin_costs.other_admin.total = sumOfPrice;
          newState[12].total_admin_costs.other_admin.total =
            (Number(newState[12].total_admin_costs.other_admin.total) ?? 0) + difference;

          return newState;
        });
      } else {
        setIncome((prev) => {
          const newState = [...prev];
          const existingExpense = newState[
            month - 1
          ].other_than_project_cogs.third_party_services.expenses.find(
            (item) => item.id == response.data.id,
          );
          if (existingExpense) {
            const difference = +price - +existingExpense.price;
            existingExpense.price = +price;
            newState[+month - 1].other_than_project_cogs.third_party_services.total =
              (newState[+month - 1].other_than_project_cogs.third_party_services.total ?? 0) +
              difference;
            newState[12].other_than_project_cogs.third_party_services.total =
              (Number(newState[12].other_than_project_cogs.third_party_services.total) ?? 0) +
              difference;
          } else {
            newState[+month - 1].other_than_project_cogs.third_party_services.expenses.push({
              ...value,
              ...data,
              price: value.price,
              id: value.id ?? response.data.id,
              price_without_formatting: value.price,
            });
            newState[+month - 1].other_than_project_cogs.third_party_services.total =
              (Number(newState[+month - 1].other_than_project_cogs.third_party_services.total) ??
                0) + +value.price;
            newState[12].other_than_project_cogs.third_party_services.total =
              (Number(newState[12].other_than_project_cogs.third_party_services.total) ?? 0) +
              +value.price;
          }
          return newState;
        });
        setOriginalIncome((prev) => {
          const newState = [...prev];
          const existingExpense = newState[
            month - 1
          ].other_than_project_cogs.third_party_services.expenses.find(
            (item) => item.id == response.data.id,
          );
          const convertedPrice = convertNumber(
            +price,
            newState[month - 1].rates[currency],
            originalCurrency !== 'GEL',
          );
          if (existingExpense) {
            const difference = convertedPrice - +existingExpense.price;
            existingExpense.price = convertedPrice;
            newState[+month - 1].other_than_project_cogs.third_party_services.total =
              (newState[+month - 1].other_than_project_cogs.third_party_services.total ?? 0) +
              difference;
            newState[12].other_than_project_cogs.third_party_services.total =
              (Number(newState[12].other_than_project_cogs.third_party_services.total) ?? 0) +
              difference;
          } else {
            newState[+month - 1].other_than_project_cogs.third_party_services.expenses.push({
              ...value,
              ...data,
              price: convertedPrice,
              id: value.id ?? response.data.id,
              price_without_formatting: convertedPrice,
            });
            newState[+month - 1].other_than_project_cogs.third_party_services.total =
              (Number(newState[+month - 1].other_than_project_cogs.third_party_services.total) ??
                0) + convertedPrice;
            newState[12].other_than_project_cogs.third_party_services.total =
              (Number(newState[12].other_than_project_cogs.third_party_services.total) ?? 0) +
              convertedPrice;
          }
          return newState;
        });
      }
      form.reset({ third_party_services: form.getValues('third_party_services') });
      setRecordsSaving(false);
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const deleteExpenseRowHandler = async () => {
    try {
      const row = form.getValues(`third_party_services.${+selectedRowIndex!}`);

      const numbersArray = Object.values(row)
        .filter((obj) => obj?.hasOwnProperty('id'))
        .map((obj) => (obj as IncomeStatementInputs[1])?.id)
        .filter((item) => item);

      const rowValues = form.getValues(`third_party_services.${+selectedRowIndex!}`);
      const deletedExpenseIds = Object.keys(rowValues)

        .map((item) => (!isNaN(+item) ? rowValues[item as MonthsType]?.id : null))
        .filter((item) => item);

      setIncome((prev) => {
        const newState = [...prev];

        for (let i = 0; i < 12; i++) {
          if (isOtherAdmin) {
            newState[i].total_admin_costs.other_admin.total -=
              rowValues[(i + 1) as (typeof months)[number]]?.price || 0;
          } else {
            newState[i].other_than_project_cogs.third_party_services.total -=
              rowValues[(i + 1) as (typeof months)[number]]?.price || 0;

            const deletedItem = newState[
              i
            ].other_than_project_cogs.third_party_services.expenses.find((item) =>
              deletedExpenseIds.includes(item.id as number),
            );

            if (deletedItem) {
              deletedItem.price = 0;
              deletedItem.id = undefined;
            }
          }
        }

        return newState;
      });

      setOriginalIncome((prev) => {
        const newState = [...prev];

        for (let i = 0; i < 12; i++) {
          const convertedPrice = convertNumber(
            rowValues[(i + 1) as (typeof months)[number]]?.price ?? 0,
            newState[i].rates?.[currency],
            originalCurrency === 'GEL',
          );
          if (isOtherAdmin) {
            newState[i].total_admin_costs.other_admin.total -= convertedPrice;
          } else {
            newState[i].other_than_project_cogs.third_party_services.total -= convertedPrice;

            const deletedItem = newState[
              i
            ].other_than_project_cogs.third_party_services.expenses.find((item) =>
              deletedExpenseIds.includes(item.id as number),
            );

            if (deletedItem) {
              deletedItem.price = 0;
              deletedItem.id = undefined;
            }
          }
        }

        return newState;
      });

      remove(+selectedRowIndex!);
      setDeleteModalIsOpen(false);
      await deleteExpenseRow(getCookie('token'), { ids: numbersArray as number[] });
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const currentRecordInfo = (inputName: string, month: number) => {
    //@ts-ignore
    const currentExpenseId = form.getValues(`${inputName}.id`);
    //@ts-ignore
    const currentExpenseRecordId = form.getValues(`${inputName}.${month}.id`);

    const currentExpenseRecord = otherExpenses.find((item) => item.id === currentExpenseId);
    const currentOtherAdminExpensePrice = currentExpenseRecord?.records?.find(
      (item) => item.id === currentExpenseRecordId,
    )?.price;

    return {
      expenseId: currentExpenseId,
      recordPrice: +currentOtherAdminExpensePrice! || 0,
      recordId: currentExpenseRecordId,
    };
  };

  const deleteExpenseRecordHandler = async (inputName: string, month: number) => {
    try {
      if (currentRecordInfo(inputName, month).recordId) {
        setIncome((prev) => {
          const newState = [...prev];

          const converted = convertNumber(
            currentRecordInfo(inputName, month).recordPrice!,
            newState[month].rates?.[currency],
            originalCurrency === 'GEL',
          );

          if (isOtherAdmin) {
            newState[month - 1].total_admin_costs.other_admin.total -= converted;
            newState[12].total_admin_costs.other_admin.total -= converted;
          } else {
            const existingExpense = newState[
              month - 1
            ].other_than_project_cogs.third_party_services.expenses.find(
              (item) => item.id === currentRecordInfo(inputName, month).recordId,
            );

            newState[12].other_than_project_cogs.third_party_services.total -= converted;
            newState[month - 1].other_than_project_cogs.third_party_services.total -= converted;

            if (existingExpense) {
              existingExpense.price = 0;
            }
          }

          return newState;
        });
        setOriginalIncome((prev) => {
          const newState = [...prev];

          if (isOtherAdmin) {
            newState[month - 1].total_admin_costs.other_admin.total -= currentRecordInfo(
              inputName,
              month,
            ).recordPrice!;
            newState[12].total_admin_costs.other_admin.total -= currentRecordInfo(
              inputName,
              month,
            ).recordPrice!;
          } else {
            const existingExpense = newState[
              month - 1
            ].other_than_project_cogs.third_party_services.expenses.find(
              (item) => item.id === currentRecordInfo(inputName, month).recordId,
            );

            newState[12].other_than_project_cogs.third_party_services.total -= currentRecordInfo(
              inputName,
              month,
            ).recordPrice!;
            newState[month - 1].other_than_project_cogs.third_party_services.total -=
              currentRecordInfo(inputName, month).recordPrice!;

            if (existingExpense) {
              existingExpense.price = 0;
            }
          }

          return newState;
        });
        const priceToSubtract = currentRecordInfo(inputName, month).recordPrice ?? 0;
        //@ts-ignore
        form.setValue(`${inputName}.${month}.price`, 0);
        //@ts-ignore
        form.setValue(`${inputName}.${month}.price_without_formatting`, 0);
        //@ts-ignore
        const prevTotal = Number(form.getValues(`${inputName}.13.price`));
        //@ts-ignore
        form.setValue(
          //@ts-ignore
          `${inputName}.13.price`,
          //@ts-ignore
          prevTotal - priceToSubtract,
        );
        form.setValue(
          //@ts-ignore
          `${inputName}.13.price_without_formatting`,
          //@ts-ignore
          prevTotal - priceToSubtract,
        );

        await deleteExpenseRecord(
          getCookie('token'),
          +currentRecordInfo(inputName, month).recordId!,
        );
        //@ts-ignore
        form.setValue(`${inputName}.${month}.id`, null);
      }
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  return {
    form,
    fields,
    append,
    remove,
    otherExpenses,
    getOtherExpenseHandler,
    saveExpenseRecord,
    setDeleteModalIsOpen,
    deleteModalIsOpen,
    setSelectedRowIndex,
    selectedRowIndex,
    setList,
    list,
    initialList,
    setInitialList,
    deleteExpenseRowHandler,
    setDepartmentList,
    departmentList,
    departmentInitialList,
    setDepartmentInitialList,
    isLoading,
    deleteExpenseRecordHandler,
    otherExpenseTitles,
    isNumberAdded,
    recordsSaving,
  };
};
