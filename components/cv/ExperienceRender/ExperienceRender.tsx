import { useStyles } from 'hooks';
import { Props } from './types';
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const ExperienceRender: React.FC<Props> = (props) => {
  const { styles, tinyMceStyles } = useStyles();
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

      <View id='companies' style={styles.dynamicFieldWrapper}>
        <Text style={{ ...styles.sectionTitle }}>
          {props.companies?.length === 1 ? 'WORK EXPERIENCE' : 'WORK EXPERIENCES'}
        </Text>
        <View style={styles.dynamicFieldChildWrapper}>
          {props.companies?.map((experience, i) => {
            const description = `<div class='fieldDescription'>${experience.description}<div>`;
            const handleItalic = description?.replace(/<em>(.*?)<\/em>/g, '$1');
            const formattedText = handleItalic.replace(/style="font-style:\s*italic;"/g, '');

            return (
              <View key={i} style={{ marginTop: 24 }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={styles.fieldRowDesc}>{experience.company}</Text>
                  <Text
                    style={{
                      ...styles.fieldRowDescThin,
                    }}
                  >{`${experience.position} ${
                    experience.location ? `• ${experience.location}` : ''
                  } ${
                    experience.start_date && experience.is_preferred
                      ? ` • ${new Date(experience.start_date).getFullYear()} ${
                          experience.end_date
                            ? `- ${new Date(experience.end_date).getFullYear()}`
                            : '- Present'
                        }`
                      : ''
                  }`}</Text>

                  {experience.description && (
                    <View
                      style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 6 }}
                    >
                      <Text style={styles.fieldRowDescTitle}>Description</Text>
                      <View>
                        <Html stylesheet={tinyMceStyles}>{formattedText}</Html>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default ExperienceRender;
