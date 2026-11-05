import {
  Modal,
  PreventTerminationModal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'components';
import { can } from 'helpers';
import React from 'react';
import { AccountTab, DeleteUserModal, RecoveryTab, UserSummary } from './components';
import { EditModalTab, PrivilegedUserEditModalProps } from './types';
import { usePrivilegedUsersEditModal } from './hooks';

const PrivilegedUsersEditModal: React.FC<PrivilegedUserEditModalProps> = ({
  modalCloser,
  permissions,
  roles,
  setUsers,
  user,
}) => {
  const {
    isSubmitting,
    submitHandler,
    isDirty,
    deleteError,
    deleteModalToggler,
    deleteHandler,
    deletingModalIsOpen,
    isDeleting,
    openedTab,
    setOpenedTab,
    isSendingPasswordRecovery,
    passwordRecoverySent,
    passwordRecoveryHandler,
    canNotTerminate,
    setCanNotTerminate,
    userProjectsInfo,
    form,
  } = usePrivilegedUsersEditModal(user, modalCloser, setUsers, roles);

  const canUpdate = !!can('user::update', permissions);
  const canDelete = !!can('user::delete', permissions);

  return (
    <>
      <Modal
        open
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isSubmitting) modalCloser();
        }}
        title={<UserSummary user={user} />}
        contentClassName='max-w-lg'
        showFooter={openedTab === 'account' && canUpdate}
        submitting={isSubmitting}
        confirmButtonDisabled={!isDirty}
        onConfirm={form.handleSubmit(submitHandler)}
      >
        <Tabs value={openedTab} onValueChange={(value) => setOpenedTab(value as EditModalTab)}>
          <TabsList variant='line'>
            <TabsTrigger value='account'>Account</TabsTrigger>
            <TabsTrigger value='recovery'>Recovery password</TabsTrigger>
          </TabsList>

          <TabsContent value='account' className='pt-4'>
            <AccountTab
              form={form}
              roles={roles}
              canUpdate={canUpdate}
              canDelete={canDelete}
              deleteError={deleteError}
              onSubmit={submitHandler}
              onDelete={deleteModalToggler}
            />
          </TabsContent>

          <TabsContent value='recovery' className='pt-4'>
            <RecoveryTab
              email={user.email}
              passwordRecoverySent={passwordRecoverySent}
              isSendingPasswordRecovery={isSendingPasswordRecovery}
              onSend={passwordRecoveryHandler}
            />
          </TabsContent>
        </Tabs>
      </Modal>

      {!canNotTerminate && deletingModalIsOpen && (
        <DeleteUserModal
          user={user}
          isDeleting={isDeleting}
          onConfirm={deleteHandler}
          onClose={deleteModalToggler}
        />
      )}

      {canNotTerminate && (
        <PreventTerminationModal
          closeModal={() => setCanNotTerminate(false)}
          userProjectsInfo={userProjectsInfo}
          title='User cannot be deleted'
        />
      )}
    </>
  );
};

export default PrivilegedUsersEditModal;
