import { useStyles } from 'hooks';
import { Props } from './types';
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { getFormattedDate } from 'helpers';
import Html from 'react-pdf-html';

const ProjectsRender: React.FC<Props> = (props) => {
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
      <View id='projects' style={{ marginBottom: 32 }}>
        <Text style={styles.sectionRedTitles}>
          {props.projects?.length === 1 ? 'PROJECT' : 'PROJECTS'}
        </Text>
        <View style={styles.fieldWrapper}>
          {props.projects?.map((project, i) => {
            const description = `<div class='fieldDescriptionProject'>${project.description}<div>`;
            const responsibilities = `<div class='fieldDescriptionProject'>${project.responsibility}<div>`;
            const handleItalicDesc = description?.replace(/<em>(.*?)<\/em>/g, '$1');
            const formattedDescription = handleItalicDesc.replace(
              /style="font-style:\s*italic;"/g,
              '',
            );

            const handleItalicRes = responsibilities?.replace(/<em>(.*?)<\/em>/g, '$1');
            const formattedRes = handleItalicRes.replace(/style="font-style:\s*italic;"/g, '');

            return (
              <View key={i} style={{ position: 'relative' }}>
                <View
                  style={{
                    paddingTop: i > 0 ? 24 : 0,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      top: i > 0 ? 22 : -2,
                      left: 0,
                      position: 'absolute',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        border: 1,
                        borderColor: '#E5E5E5',
                        width: 20,
                        height: 20,
                        borderRadius: 100,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'semibold',
                        fontFamily: 'Poppins',
                        color: '#A9A8A9',
                        position: 'absolute',
                        top: 2,
                        left: i === 10 ? 6.5 : i >= 9 ? 5 : i === 0 ? 8 : 7,
                      }}
                    >
                      {i + 1}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins',
                      fontWeight: 'semibold',
                      paddingLeft: 28,
                      textTransform: 'capitalize',
                    }}
                  >{`${project.title} • ${project.role}`}</Text>
                </View>
                <Text style={styles.fieldRowTitle}>{`${project.company ?? ''}${
                  project.industry?.name ? ` • ${project.industry?.name}` : ''
                }${
                  project.start_date && project.is_preferred
                    ? ` • ${getFormattedDate(project.start_date, true, true)} ${
                        project.end_date
                          ? `- ${getFormattedDate(project.end_date, true, true)}`
                          : '- Present'
                      }`
                    : ''
                }`}</Text>
                <View
                  style={{ display: 'flex', flexDirection: 'row', gap: 40, position: 'relative' }}
                >
                  <View style={{ display: 'flex', flexDirection: 'column' }}>
                    {project.description && (
                      <View
                        style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 6 }}
                      >
                        <Text style={styles.fieldRowDescTitle}>Description</Text>
                        <Html stylesheet={tinyMceStyles} style={{ fontSize: 10 }}>
                          {formattedDescription}
                        </Html>
                      </View>
                    )}
                    {project.responsibility && (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                          paddingTop: project.description ? 10 : 6,
                        }}
                      >
                        <Text style={styles.fieldRowDescTitle}>
                          Main features & Responsibilities
                        </Text>

                        <Html stylesheet={tinyMceStyles} style={{ fontSize: 10 }}>
                          {formattedRes}
                        </Html>
                      </View>
                    )}
                    {project.skills?.length && (
                      <View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            paddingTop: project.responsibility ? 10 : 6,
                            gap: 4,
                          }}
                        >
                          <Text style={styles.fieldRowDescTitle}>Technologies</Text>
                          <Text
                            style={{ fontFamily: 'Poppins', fontWeight: 'normal', fontSize: 10 }}
                          >
                            {project.skills?.map((item) => item.title).join(', ')}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default ProjectsRender;
