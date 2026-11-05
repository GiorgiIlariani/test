'use client';

import { getCookie } from 'cookies-next';
import { analytics } from 'helpers';
import { useState } from 'react';
import { deletePrivilegedUserRequest, getUsersCurrentAndFutureProjects } from 'services';
import { PrivilegedUsers, UserProject } from 'types';
import { SetUsers } from '../types';

export const useDeleteUser = (
  user: PrivilegedUsers,
  setUsers: SetUsers,
  modalCloser: () => void,
) => {
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingModalIsOpen, setDeletingModalIsOpen] = useState(false);
  const [canNotTerminate, setCanNotTerminate] = useState(false);
  const [userProjectsInfo, setUserProjectsInfo] = useState<UserProject[]>([]);

  const deleteModalToggler = () => {
    analytics.track('User Management - Delete User');
    setDeletingModalIsOpen((prevState) => !prevState);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleting(true);
      const userProjects = await getUsersCurrentAndFutureProjects(
        getCookie('token'),
        user.id,
        new Date().toDateString(),
      );

      if (userProjects.length) {
        setCanNotTerminate(true);
        setUserProjectsInfo(userProjects);
        setDeletingModalIsOpen(false);
      } else {
        setCanNotTerminate(false);
        await deletePrivilegedUserRequest(getCookie('token'), user.id);
        setUsers(user.id);
        modalCloser();
      }
    } catch (_error) {
      setDeletingModalIsOpen(false);
      setDeleteError(
        'An unexpected error occurred. Try reloading the page, and if the error persists, contact the developers.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteError,
    isDeleting,
    deletingModalIsOpen,
    deleteModalToggler,
    deleteHandler,
    canNotTerminate,
    setCanNotTerminate,
    userProjectsInfo,
  };
};
