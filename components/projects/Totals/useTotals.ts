'use client';
import { useEffect, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { Currency } from 'types';
import { Props } from './types';

export const useTotals = (form: Props['form']) => {
  const [totals, setTotals] = useState({
    subTotal: form.getValues('subtotal') || 0,
    freeOfCharge: form.getValues('free_of_charge') || 0,
    totalToBePaid: form.getValues('total_to_be_paid') || 0,
    discount: form.getValues('discount_amount') || 0,
    discount_percentage: form.getValues('discount_percentage') || 0,
    currency: 'EUR' as Currency,
    surcharge: form.getValues('surcharge_amount') || 0,
    vat: 0,
  });

  const [
    discount_duration,
    expenses,
    currency,
    discount,
    monthly,
    staffs,
    fixed,
    discount_percentage,
    surcharge_percentage,
  ] = useWatch({
    name: [
      'discount_duration',
      'expenses',
      'currency',
      'discount',
      'monthly',
      'staffs',
      'fixed',
      'discount_percentage',
      'surcharge_percentage',
    ],
    control: form.control,
  });

  const memoizedStaff = useMemo(() => staffs ?? [], [JSON.stringify(staffs)]);

  const { total, freeOfCharge, vat } = useMemo(
    () =>
      staffs?.reduce(
        (acc, staff) => {
          const engagement = form.getValues('engagement_measurement_unit') === 'hr' ? 1 : 8;
          const total = staff.rate * staff.engagement * engagement;
          const vat = staff.vat_amount
            ? (total - total * (discount_percentage / 100)) * (staff.vat_amount / 100)
            : 0;

          staff.is_free_of_charge ? (acc.freeOfCharge += total) : (acc.total += total);
          acc.vat = acc.vat += vat;

          return acc;
        },
        { total: 0, freeOfCharge: 0, vat: 0 },
      ) || ({ total: 0, freeOfCharge: 0, vat: 0 } as const),
    [discount_percentage, memoizedStaff],
  );

  const memoizedExpenses = useMemo(() => expenses ?? [], [JSON.stringify(expenses)]);

  const { expensesTotal, expensesVat } = useMemo(() => {
    return memoizedExpenses.reduce(
      (acc, expense) => {
        const total = +expense.price;
        const vat = expense.vat_amount
          ? (total - total * ((Number(discount_percentage) || 0) / 100)) *
            (expense.vat_amount / 100)
          : 0;

        acc.expensesTotal += total;
        acc.expensesVat += vat;
        return acc;
      },
      { expensesVat: 0, expensesTotal: 0 },
    );
  }, [memoizedExpenses, discount_percentage]);

  const memoizedMonthly = useMemo(() => monthly ?? [], [JSON.stringify(monthly)]);
  const memoizedFixed = useMemo(() => fixed ?? [], [JSON.stringify(fixed)]);

  const termsTotal = useMemo(() => {
    const { fixedTotal, fixedVat } = (Array.isArray(fixed) ? fixed : []).reduce(
      (acc, term) => {
        const total = +term.total;
        const vat = term.vat_amount
          ? (total - total * ((Number(discount_percentage) || 0) / 100)) * (term.vat_amount / 100)
          : 0;

        acc.fixedTotal += +term.total;
        acc.fixedVat += vat;
        ('staff');
        return acc;
      },
      { fixedTotal: 0, fixedVat: 0 },
    );
    const { monthlyTotal, monthlyVat } = (Array.isArray(monthly) ? monthly : []).reduce(
      (acc, term) => {
        const total = +term.total;
        const vat = term.vat_amount
          ? (total - total * ((Number(discount_percentage) || 0) / 100)) * (term.vat_amount / 100)
          : 0;
        acc.monthlyTotal += total;
        acc.monthlyVat += vat;
        ('staff');

        return acc;
      },
      { monthlyTotal: 0, monthlyVat: 0 },
    );
    return { total: fixedTotal + monthlyTotal, vatTotal: fixedVat + monthlyVat };
  }, [discount_percentage, memoizedFixed, memoizedMonthly]);

  useEffect(() => {
    let subTotal =
      (total || 0) + (freeOfCharge || 0) + (expensesTotal || 0) + (termsTotal.total || 0);
    const surcharge = (subTotal * (surcharge_percentage || 0)) / 100;
    subTotal += surcharge;
    const subTotalWithoutFreeOfCharge = subTotal - (freeOfCharge || 0);
    const discount_amount =
      (subTotalWithoutFreeOfCharge * (Number(discount_percentage) || 0)) / 100;
    const vatAmount = vat + termsTotal.vatTotal + expensesVat;
    const totalToBePaid = subTotalWithoutFreeOfCharge - discount_amount + vatAmount;
    setTotals((prev) => ({
      ...prev,
      subTotal,
      freeOfCharge,
      currency,
      totalToBePaid,
      surcharge,
      discount: discount_amount,
      discount_percentage: discount_percentage,
      vat: vatAmount,
    }));

    form.setValue('discount_amount', +discount_amount.toFixed(2));
    form.setValue('subtotal', parseFloat((+subTotal || 0).toFixed(2)));
    form.setValue('free_of_charge', +freeOfCharge.toFixed(2));
    form.setValue('total_to_be_paid', +totalToBePaid.toFixed(2));
    form.setValue('total', +totalToBePaid.toFixed(2));
    form.setValue('surcharge_amount', +surcharge.toFixed(2));
    form.setValue('vat_amount', +vatAmount.toFixed(2));
  }, [
    discount_duration,
    expensesTotal,
    freeOfCharge,
    termsTotal,
    discount,
    currency,
    total,
    vat,
    discount_percentage,
    surcharge_percentage,
    expensesVat,
  ]);

  return {
    subTotal: totals.subTotal,
    freeOfCharge: totals.freeOfCharge,
    totalToBePaid: totals.totalToBePaid,
    discount: totals.discount,
    currency: totals.currency ?? 'USD',
    vat: totals.vat,
    surcharge: totals.surcharge,
  };
};
