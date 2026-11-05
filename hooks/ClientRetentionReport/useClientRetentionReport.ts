import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { clientRetentionRequest } from 'services';
import { ClientRetention, ClientRetentionForm, ClientRetentionViewMode, Currency } from 'types';

const DEFAULT_QUARTERS = ['Q0', 'Q1', 'Q2', 'Q3'];

export const useClientRetentionReport = () => {
  const [clientRetention, setClientRetention] = useState<ClientRetention>();
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>('GEL');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ClientRetentionViewMode>('both');
  const [notResponseError, setNotResponseError] = useState(false);

  const form = useForm<ClientRetentionForm>({
    defaultValues: {
      metric: 'revenue',
    },
    mode: 'onSubmit',
  });

  const getClientRetentionReport = async () => {
    try {
      setLoading(true);
      const data = await clientRetentionRequest(getCookie('token'));
      setClientRetention(data);
    } catch (error: any) {
      toastGeneralError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClientRetentionReport();
  }, []);

  const quarterLabels = useMemo(() => {
    if (loading) return DEFAULT_QUARTERS;
    if (!clientRetention || clientRetention.cohorts.length === 0) return [];

    const maxLen = Math.max(0, ...clientRetention.cohorts.map((item: any) => item.quarters.length));

    return Array.from({ length: maxLen }, (_, i) => `Q${i}`);
  }, [clientRetention, loading]);

  const handleCohortClick = () => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const sortedCohorts =
    clientRetention?.cohorts && sortDirection === 'asc'
      ? clientRetention?.cohorts.toReversed()
      : clientRetention?.cohorts;

  return {
    cohorts: sortedCohorts,
    totals: clientRetention?.totals,
    weightedAverages: clientRetention?.weighted_averages,

    handleCohortClick,
    sortDirection,
    loading,
    currency,
    setCurrency,
    quarterLabels,
    form,
    viewMode,
    setViewMode,
    notResponseError,
    setNotResponseError,
  };
};
