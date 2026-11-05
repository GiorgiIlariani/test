import { Props } from './types';
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { roundExperience } from 'helpers';
import { useStyles } from 'hooks';

const SkillsRender: React.FC<Props> = (props) => {
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
      <View id='skills' style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>
          {props.skills?.length === 1 ? 'TECH SKILL' : 'TECH SKILLS'}
        </Text>
        <View style={styles.languagesAndSkillsWrapper}>
          {props.skills?.map((skill, i) => {
            return (
              <Text key={skill.skill_id} style={{ fontSize: 10 }}>
                {`${(skill.title as { en: string }).en ?? skill.title}`}
                <Text style={{ opacity: 0.5, fontSize: 10 }}>
                  {skill?.is_preferred
                    ? ` (${roundExperience(skill.pivot?.experience_duration as number)} ${
                        roundExperience(skill.pivot?.experience_duration as number) === 1
                          ? 'year'
                          : 'years'
                      }) `
                    : ''}
                </Text>
                {i === props.skills.length - 1 ? '' : `, `}
              </Text>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default SkillsRender;
