import type { ClientRequestValues } from 'types';

export const serializeClientRequest = (data: ClientRequestValues) => {
  if (data.contacts === undefined) return data;

  return {
    ...data,
    contacts: JSON.stringify(data.contacts),
  };
};
