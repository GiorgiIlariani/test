import { Props } from './types';
import React from 'react';
import { Text, View, Image } from '@react-pdf/renderer';
import { useStyles } from 'hooks';
import { Redberry, location } from 'assets';
import Html from 'react-pdf-html';

const PersonalDataRender: React.FC<Props> = (props) => {
  const { styles, tw, tinyMceStyles } = useStyles();
  const text = `<div class='description'>${props.data.brief_intro}<div>`;
  const handleItalic = text?.replace(/<em>(.*?)<\/em>/g, '$1');
  const formattedText = handleItalic.replace(/style="font-style:\s*italic;"/g, '');
  const isBriefIntroSelected = props.data?.sections?.find(
    (item) => item.title === 'Brief intro',
  )?.selected;

  const getCoverLineStyles = () => {
    const isLogoShown = props.data.variant === 'RDBR';
    const location = props.data?.location;

    if (isLogoShown) {
      return location ? 158 : 138;
    } else {
      return location ? 85 : 66;
    }
  };
  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 40,
          position: 'relative',
        }}
      >
        {props.data.variant === 'RDBR' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: 26,
            }}
          >
            <Image src={props.data?.logo ?? Redberry.src} style={{ height: 47 }} />
          </View>
        )}
        <View style={{ width: '483' }}>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={styles.userName}>
              {props.data.first_name} {props.data.last_name}
            </Text>
            {props.data?.location ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 4,
                  paddingTop: 4,
                  alignItems: 'center',
                }}
              >
                <Image src={location.src} style={{ height: 12 }} />
                <Text
                  style={{
                    fontFamily: styles.family.fontFamily,
                    fontWeight: 'normal',
                    fontSize: 10,
                  }}
                >
                  {props.data?.location}
                </Text>
              </View>
            ) : (
              ''
            )}
          </View>
        </View>
        {props.data.brief_intro && isBriefIntroSelected ? (
          <View style={tw('text-2xs font-bold mt-8')}>
            <View>
              <Html stylesheet={tinyMceStyles} style={{ fontSize: 10, width: 483 }}>
                {formattedText}
              </Html>

              <View
                style={{
                  backgroundColor: '#DDDCDD',
                  width: 483,
                  height: 1,
                  marginTop: 32,
                }}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              position: 'absolute',
              top: getCoverLineStyles(),
              left: 0,
              width: 483,
              height: 3,
              backgroundColor: '#ffffff',
              zIndex: 99999,
            }}
          />
        )}
      </View>
    </>
  );
};

export default PersonalDataRender;
