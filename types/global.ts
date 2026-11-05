export type UserTokenInfo = {
  iss: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  tenant: string;
};
