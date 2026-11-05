'use client';

import { InvoiceCalculationResponse, CreateInvoice, InvoiceTypes, SetState, Invoice } from 'types';
import { useContext, useEffect, useState, MouseEvent, useLayoutEffect, ChangeEvent } from 'react';
import {
  administrativeInformation,
  createInvoiceRequest,
  getGlobalRoles,
  getInvoiceVacationRequest,
  getVats,
  patchInvoiceRequest,
} from 'services';
import { useFieldArray, useForm } from 'react-hook-form';
import { getButtonText, getFormDefaultValues } from './helpers';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { GlobalApiInfo } from 'context';
import { analytics, getConsonants } from 'helpers';
import { useDebounce } from 'hooks';
import { Props } from './types';
import {
  getInvoiceInformationFromStartToEndDate,
  handleBackendErrors,
  getInvoiceViewData,
  toastGeneralError,
} from 'helpers';

export const useInvoiceModal = (
  invoiceData: Props['reviewingInvoiceData'],
  setContractAssetIsOpen?: SetState<boolean>,
  refreshInvoiceDashboard?: Props['refreshInvoiceDashboard'],
  updateInvoicesList?: Props['updateInvoicesList'],
  type?: InvoiceTypes,
  contractAssetIsOpen?: boolean,
  id?: number,
  setLoading?: Props['setLoading'],
  setErrorStatus?: Props['setErrorStatus'],
  setInvoiceType?: Props['setInvoiceType'],
  isInEdit?: Props['isInEdit'],
  handleClose?: Props['closeHandler'],
  externalForm?: Props['externalForm'],
  setIsInEdit?: Props['setIsInEdit'],
  loading?: boolean,
  setReviewModalIsOpen?: Props['setReviewModalIsOpen'],
  setInvoiceCreated?: SetState<boolean>,
  setInvoiceUpdated?: SetState<boolean>,
) => {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(GlobalApiInfo);
  const [haveOtherExpenses, setHaveOtherExpenses] = useState(false);
  const [gettingCalculations, setGettingCalculations] = useState(false);
  const [invoice, setInvoice] = useState<Awaited<InvoiceCalculationResponse>>();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: number; title: string }[]>([]);
  const [vats, setVats] = useState<{ id: number; title: string; amount: number }[]>([]);
  const [isTableDelete, setIsTableDelete] = useState({
    staffs: false,
    monthly: false,
    fixed: false,
  });
  const [bankAcounts, setBankAccounts] = useState<string[]>([]);

  const router = useRouter();
  const pageIndex = router.query.page;

  const internalForm = useForm<Invoice>({
    mode: 'onSubmit',
    defaultValues: getFormDefaultValues(router, invoiceData?.currency || 'USD') as Invoice,
    delayError: 600,
  });
  useEffect(() => {
    internalForm.setValue('currency', invoiceData?.currency ?? 'USD');
  }, [invoiceData]);

  const form = externalForm || internalForm;
  const errors = form.formState.errors;
  const {
    fields: customFields,
    append: appendCustomField,
    remove: removeCustomField,
  } = useFieldArray({
    control: form.control,
    name: 'custom_fields',
    rules: { maxLength: { value: 10, message: 'Add no more than 10 fields.' } },
  });

  const [isDiscountToggled, setIsDiscountToggled] = useState(!!form.getValues('discount'));
  const [startAndEndDates, setStartAndEndDates] = useState<
    { start_date: string; end_date: string } | undefined
  >({
    start_date: form.getValues('start_date'),
    end_date: form.getValues('end_date'),
  });
  const debouncedDates = useDebounce(startAndEndDates, 300);

  const otherExpensesChangeHandler = (e: MouseEvent<Element>) => {
    e.preventDefault();
    setHaveOtherExpenses(true);
  };

  useLayoutEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setIsLoading(true);
        let vatsData = await getVatsHandler(true);
        await getInvoiceViewData(
          id,
          form,
          vatsData!,
          setLoading,
          setErrorStatus,
          setInvoiceType,
          setHaveOtherExpenses,
        );
      } catch {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, setLoading, setErrorStatus, setInvoiceType, form]);

  const getRolesData = async () => {
    try {
      const response = await getGlobalRoles(getCookie('token'));

      setRoles(
        response?.data?.map((role) => ({
          id: role.id,
          title: role?.seniority
            ? `${role?.seniority?.title} ${role?.position?.title}`
            : `${role?.position?.title}`,
        })),
      );
    } catch (_error) {}
  };

  const getVatsHandler = async (doNotSet: boolean = false) => {
    try {
      const response = await getVats(getCookie('token'));
      let formatted = response.map((el) => ({ id: el.id, title: el.name, amount: el.value }));
      !doNotSet && setVats(formatted);
      return formatted;
    } catch (_error) {}
  };

  const getBankAccounts = async () => {
    try {
      const response = await administrativeInformation(getCookie('token'));
      const accounts = response?.administrative_information?.accounts?.map(
        (account) => account.account_number,
      );
      form.setValue('bank_accounts', accounts ?? []);
      setBankAccounts(accounts ?? []);
    } catch (_error) {}
  };

  useEffect(() => {
    getVatsHandler();
    getRolesData();
    getBankAccounts();
  }, [contractAssetIsOpen]);

  const debouncedStartDate = debouncedDates?.start_date;
  const debouncedEndDate = debouncedDates?.end_date;
  useEffect(() => {
    if (id) return;
    if (debouncedStartDate && debouncedEndDate && contractAssetIsOpen) {
      form.clearErrors();
      (async () => {
        const data = await getInvoiceInformationFromStartToEndDate(
          form,
          setGettingCalculations,
          `${invoiceData?.internal_project_id}`,
          {
            start_date: debouncedStartDate,
            end_date: debouncedEndDate,
          },
          isTableDelete,
          type,
        );

        setInvoice(data);
      })();
    }
  }, [
    invoiceData?.internal_project_id,
    contractAssetIsOpen,
    debouncedStartDate,
    debouncedEndDate,
    form,
    id,
    isTableDelete,
  ]);

  const startAndEndDateChangeHandler = async (name: string, value?: Date | null) => {
    if (!value) return;
    const changedDateObject: {
      [x: string]: string;
    } = {
      [name]: value.toDateString(),
    };
    setStartAndEndDates({
      end_date: form.getValues('end_date'),
      start_date: form.getValues('start_date'),
      ...changedDateObject,
    });
  };

  const previousScopeStartAndEndDateChangeHandler = async () => {
    const startDate = form.getValues('previous_scope_start_date');
    const endDate = form.getValues('previous_scope_end_date');

    if (!startDate || !endDate || id) return;

    try {
      setGettingCalculations(true);

      const vacations = await getInvoiceVacationRequest(
        getCookie('token'),
        invoiceData?.internal_project_id!,
        {
          previous_scope_start_date: startDate,
          previous_scope_end_date: endDate,
        },
      );

      form.setValue(
        'vacations',
        vacations?.map((el) => ({
          ...el,
          end_date: el.end_date.replaceAll('.', '-'),
          start_date: el.start_date.replaceAll('.', '-'),
          end_date_for_calculations: el.end_date_for_calculations?.replaceAll('.', '-'),
        })),
      );

      let expenses = form.getValues('expenses') || [];

      expenses = expenses.filter((expense) => !expense.name.includes('time off'));

      const groupedVacations = vacations?.reduce(
        (acc, vacation) => {
          const key = vacation.employee_id;
          if (!acc[key]) {
            acc[key] = {
              employee_id: vacation.employee_id,
              employee_first_name: vacation.employee_first_name,
              employee_last_name: vacation.employee_last_name,
              total_excluded_amount: 0,
            };
          }
          acc[key].total_excluded_amount += vacation.excluded_amount;
          return acc;
        },
        {} as Record<
          string,
          {
            employee_id: number;
            employee_first_name: string;
            employee_last_name: string;
            total_excluded_amount: number;
          }
        >,
      );

      Object.values(groupedVacations).forEach((groupedVacation) => {
        const name = `${groupedVacation.employee_first_name} ${groupedVacation.employee_last_name} time off`;
        const newExpense = {
          name,
          price: Math.round(-groupedVacation.total_excluded_amount),
        };

        expenses.push(newExpense);
      });

      form.setValue('expenses', expenses);
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        handleBackendErrors(errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error, router);
      }
    } finally {
      setGettingCalculations(false);
    }
  };

  const closeHandler = () => {
    form.reset();
    setStartAndEndDates(undefined);
    type &&
      refreshInvoiceDashboard?.(
        pageIndex?.toString() ?? '1',
        invoiceData?.internal_project_id as string,
      );
    setReviewModalIsOpen?.(true);
    setContractAssetIsOpen?.(false);
    setInvoice(undefined);
    setSubmitting(false);

    setIsTableDelete({
      staffs: false,
      monthly: false,
      fixed: false,
    });
    analytics.track('Invoice - Close');
    setSent(false);
    handleClose?.();
  };

  const submitHandler = async (data: Invoice) => {
    if (sent) return;

    if (data.engagement_measurement_unit === 'day') {
      data.staffs = data.staffs?.map((staff) => ({
        ...staff,
        engagement: staff.engagement * 8,
      }));
    }

    try {
      setSubmitting(true);
      setLoading?.(true);
      const modifiedData = {
        ...data,
        internal_project_id: invoiceData?.internal_project_id,
        type: type ?? 'contract asset',
        subtotal: id
          ? Number(data?.total)
          : (Number(data?.total) || 0) +
            (Number(data?.free_of_charge) || 0) +
            (Number(data?.discount_amount) || 0) -
            (Number(data?.vat_amount) || 0),
      };

      type === 'contract asset' && delete modifiedData.invoice_date;
      modifiedData.terms = [...(data.fixed || []), ...(data.monthly || [])].map((term) =>
        term.type === 'monthly' ? { ...term, completion_percent: 0 } : term,
      );
      modifiedData.staffs = data.staffs.map((staff) => ({
        ...staff,
        role:
          typeof staff.role === 'string'
            ? staff.role
            : roles?.find((role) => role.id === +staff.role!)?.title,
      }));
      modifiedData.discount = data.discount_percentage;

      if (id) {
        modifiedData.terms = modifiedData.terms?.map((term) => ({
          ...term,
          id: term.term_id,
        }));

        await patchInvoiceRequest(id, modifiedData, getCookie('token'));
        setInvoiceUpdated?.((prev) => !prev);
        await getInvoiceViewData(id, form, vats, setLoading);
      } else {
        await createInvoiceRequest(getCookie('token'), modifiedData as CreateInvoice);
        setInvoiceCreated?.((prev: boolean) => !prev);
        closeHandler();
        router.push(router.asPath.split('/').slice(0, -1).join('/') + '/invoices');
      }

      const invoiceSendText = getButtonText(user.role, type, sent);
      invoiceSendText === 'Save'
        ? analytics.track(`${type} - Save`)
        : invoiceSendText === 'Send for approval' && analytics.track(`${type} - Send for approval`);

      updateInvoicesList?.((router.query.page ? router.query.page : '1') as string);
      setIsInEdit?.(false);
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        handleBackendErrors(errors, form.setFocus, form.setError);
      } else {
        toastGeneralError(error, router);
      }
    } finally {
      setSubmitting(false);
      setLoading?.(false);
    }
  };

  const handleActiveCheckboxClick = (statusToAdd: 'employee' | 'role') => {
    const employee_info_to_show_in_invoice = form.getValues('employee_info_to_show_in_invoice');
    if (
      employee_info_to_show_in_invoice.length === 1 &&
      employee_info_to_show_in_invoice.includes(statusToAdd)
    ) {
      form.setValue('employee_info_to_show_in_invoice', employee_info_to_show_in_invoice);
    }
  };

  const getContractAssetName = (isNew?: boolean) => {
    const projectName = getConsonants(invoiceData?.project_name?.split(' ')[0] ?? '');
    const contractAssetStartDate = new Date(form.getValues('start_date'));

    const month = contractAssetStartDate.toLocaleString('default', { month: 'long' });
    const year = contractAssetStartDate.getFullYear();

    const typeName = type ? type : 'Contract asset';

    if (sent) {
      return `${projectName} ${typeName} ${month} ${year}`;
    }
    return form.getValues('invoice_name') || `${isNew ? 'Create' : projectName} ${typeName}`;
  };

  useEffect(() => {
    if (isInEdit) return;

    setIsTableDelete({
      staffs: false,
      monthly: false,
      fixed: false,
    });
  }, [isInEdit]);

  const isInShowMode = sent || (isInEdit != null && !isInEdit);
  const isTableOpen = (termKey: 'fixed' | 'monthly' | 'staffs') =>
    !!form.getValues(termKey)?.length &&
    (isInShowMode || !isTableDelete[termKey]) &&
    form.getValues('start_date') &&
    form.getValues('end_date') &&
    !loading;

  const transformPercentageToMaxMinValue = (e?: ChangeEvent<HTMLInputElement>) => {
    const value = e?.currentTarget?.value;

    if (!value) {
      return;
    }
    if (value.startsWith('0')) {
      e.currentTarget.value = value.replace('0', '');
    }
    if (+value > 100) {
      e.currentTarget.value = '100';
    }
    if (+value <= 0) {
      e.currentTarget.value = '0';
    }
  };

  return {
    startAndEndDateChangeHandler,
    otherExpensesChangeHandler,
    setIsDiscountToggled,
    getContractAssetName,
    setHaveOtherExpenses,
    gettingCalculations,
    setIsTableDelete,
    haveOtherExpenses,
    isDiscountToggled,
    submitHandler,
    isInShowMode,
    closeHandler,
    isTableOpen,
    submitting,
    isLoading: isLoading || gettingCalculations || loading,
    invoice,
    errors,
    router,
    form,
    sent,
    user,
    handleActiveCheckboxClick,
    isTableDelete,
    transformPercentageToMaxMinValue,
    vats,
    previousScopeStartAndEndDateChangeHandler,
    bankAcounts,
    customFields,
    appendCustomField,
    removeCustomField,
  };
};
