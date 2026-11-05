import { Dispatch, SetStateAction } from 'react';

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type FormDirtyFields<T> = {
  [key in keyof T]: boolean;
};

export type ValueOf<T> = T[keyof T];

export type Merge<T, K> = Omit<T, keyof K> & K;
