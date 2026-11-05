import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { ChangeEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { getInvoiceCalculationRequest, getInvoiceInfoRequest } from 'services';
import {
  Invoice,
  InvoiceCalculationResponse,
  InvoiceTypes,
  PaidStatus,
  SetState,
  TimeLogEntryStatus,
} from 'types';
import { handleBackendErrors, validateThatDateIsSane } from 'helpers';
import { GrayTickCircle, GreenCircleCheck, YellowTick } from 'components';

export const getPaidTagColors = (status: PaidStatus) => {
  switch (status) {
    case 'p':
      return {
        background: '#ECFDF5',
        color: '#059669',
        text: 'Paid',
      };
      break;
    case 'pp':
      return {
        background: '#FFFBEB',
        color: '#D97706',
        text: 'Partially paid',
      };
    case 'np':
      return {
        background: '#FEF2F2',
        color: '#DC2626',
        text: 'Not paid',
      };
    default:
      break;
  }
};

export const formatCurrencyInput = (e: ChangeEvent<HTMLInputElement>) => {
  if ((e.target.value.match(/\./g) || []).length === 1 && e.target.value.endsWith('.')) {
    return e.target.value;
  } else if ((e.target.value.match(/\./g) || []).length === 2 && e.target.value.endsWith('.')) {
    return e.target.value.slice(0, -1);
  } else {
    return new Intl.NumberFormat().format(Number(e.target.value.replaceAll(',', '')));
  }
};

export const getInvoiceViewData = async (
  id: number,
  form: UseFormReturn<Invoice>,
  vats: { id: number; title: string; amount: number }[],
  setLoading?: SetState<boolean>,
  setErrorStatus?: SetState<number>,
  setInvoiceType?: SetState<InvoiceTypes>,
  setHaveOtherExpenses?: SetState<boolean>,
) => {
  try {
    const res = await getInvoiceInfoRequest(getCookie('token'), id);
    const engagementMeasurementUnit =
      res.engagement_measurement_unit ?? form.getValues('engagement_measurement_unit');

    setHaveOtherExpenses?.(!!res?.expenses?.length);
    const result = {
      staffs: res.default.employees.map((employee) => {
        const numberEngagementInHours = +employee.engagement_in_hrs;
        return {
          id: employee.id,
          engagement_in_hrs: +employee.engagement_in_hrs,
          engagement:
            engagementMeasurementUnit === 'hr'
              ? +numberEngagementInHours.toFixed(1)
              : +(numberEngagementInHours / 8).toFixed(1),
          original_engagement_without_formatting:
            engagementMeasurementUnit === 'hr'
              ? +employee.engagement_in_hrs
              : +employee.engagement_in_hrs / 8,
          employee_id: employee.id,
          is_free_of_charge: !!employee.is_free_of_charge,
          rate: employee.rate,
          role: employee.role,
          vat_id: employee.vat_id,
          vat_amount: vats?.find((el) => el.id === employee.vat_id)?.amount ?? null,
        };
      }),
      vacations: res.default.vacations.map((el) => {
        return {
          ...el,
          end_date: el.end_date.replaceAll('.', '-'),
          start_date: el.start_date.replaceAll('.', '-'),
          end_date_for_calculations: el.end_date_for_calculations?.replaceAll('.', '-'),
        };
      }),
      terms: res.fixed.terms.concat(res.monthly.terms),
      fixed: res.fixed.terms.map((term) => ({
        ...term,
        vat_amount: vats?.find((el) => el.id === term.vat_id)?.amount,
      })),
      monthly: res.monthly.terms.map((term) => ({
        ...term,
        vat_amount: vats?.find((el) => el.id === term.vat_id)?.amount,
      })),
      invoice_name: `${res.internal_project.title} #${res.generated_id}`,
      engagement_measurement_unit: engagementMeasurementUnit,
      fee_given_in: res.fee_given_in ?? 'USD',
      fee_shall_be_paid_in: res.fee_shall_be_paid_in ?? 'USD',
      employee_info_to_show_in_invoice: res.employee_info_to_show_in_invoice ?? [
        'employee',
        'role',
      ],
      expenses: res.expenses.map((el) => ({
        ...el,
        vat_amount: vats?.find((vat) => vat.id === el.vat_id)?.amount,
      })),
      approval_status: res?.approval_status,
      currency: res.currency ?? 'USD',
      discount: res.discount?.toFixed(2),
      end_date: res.end_date,
      id: res.id,
      internal_project_id: res.internal_project_id,
      payment_status: res.payment_status,
      start_date: res.start_date,
      partially_paid_amount: convertNumbersAsPrice(+res.partially_paid_amount! || 0),
      service_fee_payment_agreed: res.service_fee_payment_agreed,
      invoice_date: res.invoice_date,
      discount_amount: res.discount_amount,
      total: res.total,
      deleted: res.deleted,
      page_number: res.page_number,
      holidays: res.holidays,
      total_to_be_paid: res.total_to_be_paid,
      vat_amount: res.vat_amount,
      free_of_charge: res.free_of_charge,
      subtotal: res.subtotal,
      vat_percentage: res.vat_percentage,
      surcharge_percentage: res.surcharge_percentage,
      discount_percentage: res.discount,
      previous_scope_start_date: res.previous_scope_start_date,
      previous_scope_end_date: res.previous_scope_end_date,
      is_revenue_invoice: res.is_revenue_invoice,
      bank_accounts: res.bank_accounts ?? [],
      custom_fields: res.custom_fields ?? [],
    };

    form.reset(result as unknown as Invoice);
    setLoading?.(false);
    if (setInvoiceType && res.type) {
      setInvoiceType(res.type);
      form.setValue('type', res.type);
    }
    form.setValue('type', res.type);
    return res;
  } catch (error: any) {
    setErrorStatus?.(error?.response?.status);
  }
};

export const getInvoiceInformationFromStartToEndDate = async (
  form: UseFormReturn<Invoice>,
  setLoading: SetState<boolean>,
  projectId: string | number,
  dates: {
    start_date: string | undefined;
    end_date: string | undefined;
  },
  isTableDelete: {
    staffs: boolean;
    monthly: boolean;
    fixed: boolean;
  },
  invoiceType: InvoiceTypes = 'invoice',
) => {
  const startDateString = dates?.start_date;
  const endDateString = dates?.end_date;
  const engagementMeasurementUnit = form?.getValues('engagement_measurement_unit');
  let data: Awaited<InvoiceCalculationResponse> | undefined = undefined;

  if (
    startDateString &&
    endDateString &&
    validateThatDateIsSane(startDateString) &&
    validateThatDateIsSane(endDateString) &&
    engagementMeasurementUnit
  ) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    if (endDate < startDate) {
      form.setError('end_date', {
        message: 'The end date must be a date after or equal to start date',
        type: 'validate',
      });
    } else {
      setLoading(true);
      try {
        data = await getInvoiceCalculationRequest(getCookie('token'), projectId, {
          end_date: endDateString,
          start_date: startDateString,
          type: invoiceType,
        });

        form.setValue(
          'holidays',
          data.default.holidays?.map((el) => ({
            ...el,
            date: el.date.replaceAll('.', '-'),
          })),
        );

        if (invoiceType !== 'proforma') {
          form.setValue(
            'vacations',
            data.default.vacations?.map((el) => ({
              ...el,
              end_date: el.end_date.replaceAll('.', '-'),
              start_date: el.start_date.replaceAll('.', '-'),
              end_date_for_calculations: el.end_date_for_calculations?.replaceAll('.', '-'),
            })),
          );
        }

        !isTableDelete.staffs &&
          form.setValue(
            'staffs',
            data.default.employees.map((employee) => ({
              employee_id: employee.id,
              role: employee.role,
              engagement:
                engagementMeasurementUnit === 'hr'
                  ? +employee.engagement_in_hrs.toFixed(1)
                  : +(employee.engagement_in_hrs / 8).toFixed(1),
              id: employee.id,
              is_free_of_charge: !!employee.is_free_of_charge,
              rate: employee.rate,
              original_engagement_without_formatting:
                engagementMeasurementUnit === 'hr'
                  ? +employee.engagement_in_hrs
                  : +employee.engagement_in_hrs / 8,
            })),
          );
        !isTableDelete.fixed &&
          form.setValue(
            'fixed',
            data.fixed.terms.map((obj) => ({
              ...obj,
              fee: parseFloat(obj.fee.toFixed(1)),
              total: parseFloat(obj.total.toFixed(1)),
              completion_percent: parseFloat((obj.completion_percent || 0)?.toFixed(1)),
            })),
          );
        !isTableDelete.monthly &&
          form.setValue(
            'monthly',
            data.monthly.terms.map((obj) => ({
              ...obj,
              fee: parseFloat(obj.fee.toFixed(1)),
              total: parseFloat(obj.total.toFixed(1)),
              completion_percent: parseFloat((obj.completion_percent || 0)?.toFixed(1)),
            })),
          );
        form.setValue('terms', [...data.fixed.terms, ...data.monthly.terms]);
        form.setValue('total', data.total);
        form.setValue(
          'discount',
          parseFloat(((data.discount_amount / data.total) * 100)?.toFixed(1)),
        );
        form.setValue(
          'discount_percentage',
          parseFloat(((data.discount_amount / data.total) * 100)?.toString()),
        );
      } catch (error: any) {
        const errors = error.response?.data?.errors;
        if (errors) {
          handleBackendErrors(errors, form.setFocus, form.setError, undefined, true);
        } else {
          toastGeneralError(error);
        }
      } finally {
        setLoading(false);
        return data;
      }
    }
  }
};

export const convertNumbersAsPrice = (price: number, maximumFractionDigits = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(price);
};

export const getTermStatusIcon = (status: TimeLogEntryStatus, size?: string) => {
  switch (status) {
    case 'submitted':
      return <GrayTickCircle size={size} />;
    case 'approved':
      return <GreenCircleCheck size={size} />;
    case 'draft':
      return <YellowTick size={size} />;
    case 'none':
      return '';
    default:
      return <YellowTick fill='#DFE2E7' stroke='#9DA1A9' size={size} />;
  }
};
