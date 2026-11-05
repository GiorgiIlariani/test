'use client';

import { Font, StyleSheet } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

export const useStyles = () => {
  const tw = createTw({});

  Font.register({
    family: 'Poppins',
    fonts: [
      {
        src: '/fonts/Poppins/Poppins-Light.ttf',
        fontWeight: 'thin',
      },
      {
        src: '/fonts/Poppins/Poppins-Regular.ttf',
        fontWeight: 'normal',
      },
      {
        src: '/fonts/Poppins/Poppins-SemiBold.ttf',
        fontWeight: 'semibold',
      },
      {
        src: '/fonts/Poppins/Poppins-Bold.ttf',
        fontWeight: 'bold',
      },
    ],
  });

  const styles = StyleSheet.create({
    family: {
      fontFamily: 'Poppins',
    },
    bold: {
      fontWeight: 'bold',
    },
    sectionTitle: {
      textAlign: 'left',
      fontSize: 12,
      color: '#F93B1D',
      fontWeight: 'bold',
      fontFamily: 'Poppins',
    },
    sectionWrapper: {
      display: 'flex',
      flexDirection: 'column',
      width: 483,
      fontFamily: 'Poppins',
      fontWeight: 'normal',
      marginBottom: 32,
    },
    dynamicFieldWrapper: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 32,
      fontFamily: 'Poppins',
      fontWeight: 'normal',
      width: 483,
    },
    languagesAndSkillsWrapper: {
      width: '483px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 24,
    },
    dynamicFieldChildWrapper: {
      width: 483,
      display: 'flex',
      flexDirection: 'column',
    },
    sectionRedTitles: {
      color: '#F93B1D',
      fontWeight: 'bold',
      fontSize: 12,
      fontFamily: 'Poppins',
    },
    userName: {
      color: '#F93B1D',
      fontWeight: 'bold',
      fontSize: 16,
      fontFamily: 'Poppins',
      textTransform: 'capitalize',
    },
    fieldWrapper: {
      width: 483,
      marginTop: 24,
      display: 'flex',
      flexDirection: 'column',
    },
    fieldRowTitle: {
      fontSize: 10,
      paddingTop: 8,
      fontWeight: 'thin',
      fontFamily: 'Poppins',
    },
    fieldRowDesc: {
      fontSize: 10,
      width: 317,
      fontWeight: 'semibold',
      fontFamily: 'Poppins',
      color: '#000000',
    },
    fieldRowDescTitle: {
      fontSize: 8,
      fontWeight: 'semibold',
      fontFamily: 'Poppins',
      color: '#A9A8A9',
    },
    fieldRowDescThin: {
      fontSize: 10,
      width: 483,
      fontWeight: 'thin',
      fontFamily: 'Poppins',
      color: '#000000',
      paddingTop: 4,
    },
  });

  const tinyMceStyles = {
    strong: {
      fontFamily: 'Poppins',
      fontWeight: 'bold',
      fontSize: 10,
    },
    p: {
      fontSize: 10,
      fontFamily: 'Poppins',
      fontWeight: 'normal',
      marginTop: -6,
    },
    em: {
      fontSize: 10,
      fontFamily: 'Poppins',
      fontWeight: 'normal',
      marginTop: -6,
    },
    li: {
      fontSize: 10,
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    ul: {
      marginTop: -6,
    },
    ol: {
      marginTop: -6,
    },
    ['.description']: {
      marginTop: 14,
      width: 483,
      marginBottom: -12,
    },
    ['.fieldDescription']: {
      marginTop: 5,
      width: 483,
      marginBottom: -18,
    },
    ['.fieldDescriptionProject']: {
      marginTop: 5,
      width: 483,
      marginBottom: -14,
    },
  };
  return { tw, styles, tinyMceStyles };
};
