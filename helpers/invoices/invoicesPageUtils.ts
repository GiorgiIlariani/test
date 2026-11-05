import { getCookie } from 'cookies-next';
import { handleBackendErrors } from 'helpers/employeeFormUtils';
import { toastGeneralError } from 'helpers/utils';
import { UseFormGetValues, UseFormSetError, UseFormSetFocus } from 'react-hook-form';
import { editInvoicePaidStatus } from 'services';
import { FilterOptions, FilterOptionsForApi, SetState } from 'types';

export const formatFilterOptionsForBackend = (
  filterOptions: FilterOptions[],
  doNotShiftConditionAnd?: boolean,
): FilterOptionsForApi[] => {
  return filterOptions.map((filter, i) => {
    const previousFilter = filterOptions[i - 1];
    filter.meta?.startDate?.setHours(4, 0, 0, 0);
    filter.meta?.endDate?.setHours(4, 0, 0, 0);

    return {
      condition_is_and:
        previousFilter && !doNotShiftConditionAnd
          ? previousFilter.ConditionIsAnd
          : !!!filter.childConditions.at(-1)?.ConditionIsAnd || filter.ConditionIsAnd,
      child_conditions: filter.childConditions.map((el) => ({
        id: el.id,
        condition_is_and: el.ConditionIsAnd,
        value: el.value,
      })),
      id: filter.id,
      negate_condition: !filter.isIsNot,
      value: filter.value,
      type: filter.type,
      meta: {
        start_date: filter.meta?.startDate?.toISOString(),
        end_date: filter.meta?.endDate?.toISOString(),
      },
    };
  });
};

export const changeStatusHandler = async (
  getValues: UseFormGetValues<any>,
  changingPartiallyPaid: boolean,
  setChangeStatusLoading: SetState<boolean>,
  setChangingPartiallyPaid: SetState<boolean>,
  setFocus: UseFormSetFocus<any>,
  setError: UseFormSetError<any>,
  setChangingStatus: SetState<boolean>,
) => {
  if (getValues('payment_status') === 'pp') {
    if (changingPartiallyPaid) {
      try {
        setChangeStatusLoading(true);

        await editInvoicePaidStatus(
          getCookie('token'),
          {
            payment_status: getValues('payment_status'),
            partially_paid_amount: +getValues('partially_paid_amount')?.replaceAll(',', ''),
          },
          getValues('id'),
        );
        setChangingPartiallyPaid(false);
      } catch (error: any) {
        if (error?.response?.status === 422) {
          handleBackendErrors(error?.response?.data.errors, setFocus, setError);
        } else {
          toastGeneralError(error);
        }
      } finally {
        setChangeStatusLoading(false);
      }
    } else {
      setChangingPartiallyPaid(true);
      setChangingStatus(false);
    }
    return;
  }
  try {
    setChangeStatusLoading(true);
    await editInvoicePaidStatus(
      getCookie('token'),
      {
        payment_status: getValues('payment_status'),
      },
      getValues('id'),
    );
    setChangingStatus(false);
  } catch (error) {
    toastGeneralError(error);
  } finally {
    setChangeStatusLoading(false);
  }
};
