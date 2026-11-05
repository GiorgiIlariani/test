import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  createOrUpdateMappings,
  getMappings,
  getProjectTitlesRequest,
  getMoneyBirdContacts,
} from 'services';
import { MappingData } from 'types';

export const useContactMappingSection = (credentialsUpdated: boolean) => {
  let data;

  const form = useForm<{
    mappings: {
      id: number | null;
      entity_id: number;
      integration_entity_id: string | number | null;
    }[];
  }>(data);
  const [projects, setProjects] = useState<{ id: number; title: string }[]>([]);
  const [moneyBirdContactList, setMoneyBirdContactList] = useState<
    { id: string | number; title: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (data: {
    mappings: {
      id: number | null;
      entity_id: number;
      integration_entity_id: string | null | number;
    }[];
  }) => {
    try {
      setLoading(true);
      await createOrUpdateMappings(getCookie('token'), {
        mappings: data.mappings?.map((map) => ({
          ...map,
          integration_mapping_id: map.id,
          type: 'project',
        })),
      });

      setLoading(false);
      setIsSubmitted(true);
    } catch (_error) {
      setLoading(false);
    }
  };

  const formatMappings = (projects: { id: number; title: string }[], mapping: MappingData[]) => {
    return projects.map((project) => {
      let integration = mapping.find((map) => map.model_id == project.id);

      return {
        id: integration?.id ?? null,
        entity_id: project.id,
        integration_entity_id: integration?.integration_entity_id ?? null,
      };
    });
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [projects, moneyBirdContacts, mapping] = await Promise.all([
          getProjectTitlesRequest(getCookie('token')),
          getMoneyBirdContacts(getCookie('token')),
          getMappings(getCookie('token'), 'project'),
        ]);
        setProjects(projects);
        setMoneyBirdContactList(
          moneyBirdContacts?.map((contact) => ({
            id: contact.id,
            title: contact?.firstname
              ? `${contact?.firstname} ${contact?.lastname} ${
                  contact.company_name ? `- ${contact.company_name}` : ''
                }`
              : contact.company_name,
          })),
        );

        let finalMappings = formatMappings(projects, mapping);
        form.reset({
          mappings: finalMappings,
        });
        data = { mappings: finalMappings };

        setLoading(false);
      } catch (_error) {
        setLoading(false);
      }
    })();
  }, [credentialsUpdated]);

  const cancelHandler = () => {
    form.reset();
  };

  const isButtonDisabled = !form.formState.isDirty || isSubmitted;

  return {
    form,
    handleSubmit,
    projects,
    moneyBirdContactList,
    loading,
    cancelHandler,
    isButtonDisabled,
    setIsSubmitted,
  };
};
