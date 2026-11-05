import { useStyles } from 'hooks';
import { Props } from './types';
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const AchievementsRender: React.FC<Props> = (props) => {
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

      <View id='achievement' style={styles.dynamicFieldWrapper}>
        <Text style={{ ...styles.sectionTitle }}>ACHIEVEMENTS AND CERTIFICATIONS</Text>
        <View style={styles.dynamicFieldChildWrapper}>
          {props.achievements?.map((achievement, i) => {
            const description = `<div class='fieldDescription'>${achievement.description}<div>`;
            const handleItalic = description?.replace(/<em>(.*?)<\/em>/g, '$1');
            const formattedText = handleItalic.replace(/style="font-style:\s*italic;"/g, '');

            return (
              <View key={i} style={{ marginTop: 24 }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={styles.fieldRowDesc}>{achievement.organization}</Text>
                  <Text
                    style={{
                      ...styles.fieldRowDescThin,
                    }}
                  >{`${achievement.name} • ${achievement.year}`}</Text>

                  {achievement.description && (
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

export default AchievementsRender;
