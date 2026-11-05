'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { getLocations } from 'services';

export const useEmployeeLocation = (inputName: string) => {
  const [locations, setLocations] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const { setValue } = useFormContext();
  const locationRef = useRef<HTMLDivElement>(null);

  const getLocationsHandler = async (query: string = '') => {
    try {
      setInput(query);
      setValue(inputName, query);

      let debounce;

      if (debounce) {
        clearTimeout(debounce);
      }

      if (query) {
        debounce = setTimeout(async () => {
          const response = await getLocations(getCookie('token'), query);

          setLocations(
            response.map((item) =>
              item.country ? `${item.city}, ${item.country.country}` : `${item.city}`,
            ),
          );
        }, 200);
      } else {
        setLocations([]);
      }
    } catch (error: any) {
      toastGeneralError(error);
    }
  };
  return { locations, setValue, getLocationsHandler, input, locationRef };
};
