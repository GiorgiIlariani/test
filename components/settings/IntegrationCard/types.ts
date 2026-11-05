export type Props = {
  name: string;
  description: string;
  redirectPage: string;
  logo?: React.ReactNode;
  isConnected: boolean;
  hideDisconnect?: boolean;
  disconnectHandler?: (name: string) => void;
  alwaysShowConfigure?: boolean;
  isLoading: boolean;
};
