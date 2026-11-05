import { useStyles } from 'hooks';
import { Props } from './types';
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { getFormattedDate } from 'helpers';

const CourseRender: React.FC<Props> = (props) => {
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

      <View id='course' style={styles.dynamicFieldWrapper}>
        <Text style={{ ...styles.sectionTitle }}>
          {props.courses?.length === 1 ? 'COURSE' : 'COURSES'}
        </Text>
        <View style={styles.dynamicFieldChildWrapper}>
          {props.courses?.map((course, i) => {
            return (
              <View key={i} style={{ marginTop: 24 }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={styles.fieldRowDesc}>{course.school}</Text>
                  <Text style={styles.fieldRowDescThin}>{`${course.course_name}${
                    course.start_date
                      ? ` • ${getFormattedDate(course.start_date, true, true)} ${
                          course.end_date
                            ? `- ${getFormattedDate(course.end_date, true, true)}`
                            : '- Present'
                        }`
                      : ''
                  } `}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default CourseRender;
