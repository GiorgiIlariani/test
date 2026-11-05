import { Props } from './types';
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { useStyles } from 'hooks';

const LanguagesRender: React.FC<Props> = (props) => {
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
      <View id='languages' style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>
          {props.languages?.length === 1 ? 'LANGUAGE' : 'LANGUAGES'}
        </Text>
        <View style={styles.languagesAndSkillsWrapper}>
          {props.languages?.map((language, i) => (
            <>
              <Text key={language.id} style={{ fontSize: 10 }}>
                {`${language.name ?? language.title} `}{' '}
                <Text style={{ opacity: 0.5, fontSize: 10, textTransform: 'capitalize' }}>
                  ({language.pivot?.level ?? language.level})
                </Text>
                {i === props.languages?.length - 1 ? '' : `, `}
              </Text>
            </>
          ))}
        </View>
      </View>
    </>
  );
};

export default LanguagesRender;
