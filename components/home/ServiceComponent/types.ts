import { StaticImageData } from 'next/image';
import { Ref } from 'react';

export type Props = {
  images: StaticImageData[];
  services: { title: string; icon: JSX.Element; text: string }[];
  refs: Ref<HTMLDivElement>;
  title: string;
};
