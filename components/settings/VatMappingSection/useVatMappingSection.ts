import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createOrUpdateMappings, getMappings, getMoneyBirdVats, getVats } from 'services';
import { MappingData } from 'types';

export const useVatMappingSection = (credentialsUpdated: boolean) => {
  let data;

  const form = useForm<{
    mappings: {
      id: number | null;
      entity_id: number;
      integration_entity_id: string | number | null;
    }[];
  }>(data);

  const [vatList, setVatList] = useState<{ id: number; title: string }[]>([]);
  const [moneyBirdVatList, setMoneyBirdVatList] = useState<
    { id: string | number; title: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (data: {
    mappings: {
      id: number | null;
      entity_id: number;
      integration_entity_id: string | number | null;
    }[];
  }) => {
    try {
      setLoading(true);
      await createOrUpdateMappings(getCookie('token'), {
        mappings: data.mappings?.map((map) => ({
          ...map,
          integration_mapping_id: map.id,
          type: 'vat',
        })),
      });

      updateMappings();
      setIsSubmitted(true);
    } catch (error) {
      setLoading(false);

      toastGeneralError(error);
    }
  };

  const formatMappings = (
    vats: {
      id: number;
      value: number;
      name: string;
    }[],
    mapping: MappingData[],
  ) => {
    return vats.map((vat) => {
      let integration = mapping.find((map) => map.model_id == vat.id);
      return {
        id: integration?.id ?? null,
        entity_id: vat.id,
        integration_entity_id: integration?.integration_entity_id ?? null,
      };
    });
  };

  const updateMappings = async () => {
    try {
      setLoading(true);
      const [vats, moneyBirdVat, mapping] = await Promise.all([
        getVats(getCookie('token')),
        getMoneyBirdVats(getCookie('token')),
        getMappings(getCookie('token'), 'vat'),
      ]);

      setVatList(vats?.map((vat) => ({ id: vat.id, title: vat.name })));
      setMoneyBirdVatList(moneyBirdVat?.map((vat) => ({ id: vat.id, title: vat.name })));
      let finalMappings = formatMappings(vats, mapping);

      form.reset({
        mappings: finalMappings,
      });
      data = { mappings: finalMappings };
      setLoading(false);
    } catch (_error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateMappings();
  }, [credentialsUpdated]);

  const cancelHandler = () => {
    form.reset();
  };

  const isButtonDisabled = !form.formState.isDirty || isSubmitted;

  return {
    form,
    handleSubmit,
    vatList,
    moneyBirdVatList,
    loading,
    cancelHandler,
    isButtonDisabled,
    setIsSubmitted,
  };
};
