import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { getClientDetailsRequest, getProjectClientsRequest } from 'services';
import { ClientDetail, ClientSummary } from 'types';

type ClientModalState = {
  type: 'add' | 'edit' | 'detail' | 'delete';
  clientId: number | null;
  client: ClientDetail | null;
};

export const useClients = () => {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [areClientsLoading, setAreClientsLoading] = useState(false);
  const [clientModal, setClientModal] = useState<ClientModalState | null>(null);

  const fetchClients = async () => {
    setAreClientsLoading(true);

    try {
      const data = await getProjectClientsRequest(getCookie('token'));
      setClients(data);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setAreClientsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClientDetails = async (clientId: number) => {
    try {
      return await getClientDetailsRequest(getCookie('token'), clientId);
    } catch (error) {
      toastGeneralError(error);
      return null;
    }
  };

  const openClientModal = async (type: ClientModalState['type'], clientId?: number) => {
    if (type === 'add') {
      setClientModal({ type, clientId: null, client: null });
      return;
    }

    if (clientId === undefined) return;

    setClientModal({ type, clientId, client: null });

    const client = await fetchClientDetails(clientId);

    setClientModal((currentModal) => {
      if (currentModal?.type !== type || currentModal.clientId !== clientId) return currentModal;

      return client ? { ...currentModal, client } : null;
    });
  };

  const handleClientModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setClientModal(null);
  };

  const handleAddClient = () => openClientModal('add');
  const handleEditClient = (clientId: number) => openClientModal('edit', clientId);
  const handleViewClient = (clientId: number) => openClientModal('detail', clientId);
  const handleDeleteClient = (clientId: number) => openClientModal('delete', clientId);

  const isAddClientModalOpen = clientModal?.type === 'add' || clientModal?.type === 'edit';
  const isClientDetailModalOpen = clientModal?.type === 'detail';
  const isClientDeleteModalOpen = clientModal?.type === 'delete';
  const isClientDetailsLoading =
    clientModal !== null && clientModal.type !== 'add' && clientModal.client === null;

  return {
    clients,
    areClientsLoading,
    isClientDetailsLoading,
    isAddClientModalOpen,
    isClientDetailModalOpen,
    isClientDeleteModalOpen,
    handleClientModalOpenChange,
    selectedClient: clientModal?.client ?? null,
    handleAddClient,
    handleEditClient,
    handleViewClient,
    handleDeleteClient,
    refreshClients: fetchClients,
  };
};
