import { StaticImageData } from 'next/image';

export type Props = {
  header: string;
  body: string;
  link: string;
  image?: StaticImageData;
  imageClasses?: string;
  extraVioletText?: string;
};
