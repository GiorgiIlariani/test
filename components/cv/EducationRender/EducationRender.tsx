import { useStyles } from 'hooks';
import { Props } from './types';
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { getFormattedDate } from 'helpers';

const EducationRender: React.FC<Props> = (props) => {
  const { styles } = useStyles();

  return (
    <>
      <View
        style={{
          backgroundColor: '#DDDCDD',
          width: 483,
          height: 1,
          marginBottom: 32,
          zIndex: 4,
        }}
      />

      <View id='education' style={styles.dynamicFieldWrapper}>
        <Text style={{ ...styles.sectionTitle }}>
          {props.educations?.length === 1 ? 'EDUCATION' : 'EDUCATIONS'}
        </Text>
        <View style={styles.dynamicFieldChildWrapper}>
          {props.educations?.map((education, i) => {
            return (
              <View key={i} style={{ marginTop: 24 }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={styles.fieldRowDesc}>{education.university}</Text>
                  <Text
                    style={{
                      ...styles.fieldRowDescThin,
                    }}
                  >{`${education.faculty} • ${education.degree} ${
                    education.start_date && education.is_preferred
                      ? ` • ${getFormattedDate(education.start_date, true, true)} ${
                          education.finish_date
                            ? `- ${getFormattedDate(education.finish_date, true, true)}`
                            : '- Present'
                        }`
                      : ''
                  }`}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default EducationRender;
