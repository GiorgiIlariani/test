export type Props = {
  roles: { id: number; name: string }[];
  inviteUserModalIsOpen: boolean;
  setInviteUserModalIsOpen: (isOpen: boolean) => void;
  getUsers: () => void;
};
