import {
  AddClientModal,
  ClientDeleteModal,
  ClientDetailModal,
  ClientsHeader,
  ClientsTable,
  Layout,
} from 'components';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES } from 'config';
import { ClientsPageProps } from 'types';
import { useClients } from 'hooks';

const Clients: NextPage<ClientsPageProps> = (props) => {
  const {
    clients,
    areClientsLoading,
    isClientDetailsLoading,
    isAddClientModalOpen,
    isClientDetailModalOpen,
    isClientDeleteModalOpen,
    handleClientModalOpenChange,
    selectedClient,
    handleAddClient,
    handleEditClient,
    handleViewClient,
    handleDeleteClient,
    refreshClients,
  } = useClients();

  return (
    <>
      <Layout
        permissions={props.permissions}
        hideOverflow={true}
        searchable={true}
        topCategories={PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES}
        filterText='Filter and search in projects'
        disableLoading={true}
        parentClass='bg-[#F9FAFB]'
      >
        <Head>
          <meta name='robots' content='noindex,nofollow' />
          <title>Clients</title>
        </Head>

        <div className='w-full'>
          <ClientsHeader permissions={props.permissions} onOpen={handleAddClient} />
          <ClientsTable
            clients={clients}
            areClientsLoading={areClientsLoading}
            onEditClient={handleEditClient}
            onViewClient={handleViewClient}
            onDeleteClient={handleDeleteClient}
          />
        </div>

        {isAddClientModalOpen && (
          <AddClientModal
            open={isAddClientModalOpen}
            loading={isClientDetailsLoading}
            onOpenChange={handleClientModalOpenChange}
            refreshClients={refreshClients}
            selectedClient={selectedClient}
          />
        )}

        {isClientDetailModalOpen && (
          <ClientDetailModal
            open={isClientDetailModalOpen}
            loading={isClientDetailsLoading}
            onOpenChange={handleClientModalOpenChange}
            client={selectedClient}
          />
        )}

        {isClientDeleteModalOpen && (
          <ClientDeleteModal
            open={isClientDeleteModalOpen}
            loading={isClientDetailsLoading}
            onOpenChange={handleClientModalOpenChange}
            refreshClients={refreshClients}
            selectedClient={selectedClient}
            clients={clients}
          />
        )}
      </Layout>
    </>
  );
};

export default Clients;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');

  const permissions = getPermissions(context);

  if (!canVisitRoute('project::view', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }

  try {
    return {
      props: {
        permissions,
        filter: context.query.filter?.toString() ?? '[]',
      },
    };
  } catch (err: any) {
    return ssrErrorHandler(err, context.req, context.res, context.resolvedUrl);
  }
};
