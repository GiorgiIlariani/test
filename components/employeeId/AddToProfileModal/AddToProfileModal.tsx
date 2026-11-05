import { Props } from './types';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AddToProfileModalListItem,
  Modal,
} from 'components';
import { ADD_TO_PROFILE_SECTION_TITLES } from 'config';

const AddToProfileModal: React.FC<Props> = (props) => {
  return (
    <Modal
      title='Add to Profile'
      open={props.addProfileInfoIsOpen}
      onOpenChange={props.setAddProfileInfoIsOpen}
      showFooter={false}
      contentClassName='max-w-100'
    >
      <Accordion multiple defaultValue={ADD_TO_PROFILE_SECTION_TITLES}>
        {ADD_TO_PROFILE_SECTION_TITLES.map((section) => {
          const sectionData = props.profileSection[section];

          return (
            <AccordionItem key={section} value={section}>
              <AccordionTrigger className='capitalize hover:no-underline'>
                {section === 'default' ? 'required' : section}
              </AccordionTrigger>

              <AccordionContent>
                <ul>
                  {sectionData.map((item) => (
                    <AddToProfileModalListItem
                      key={item.id}
                      sectionItemData={item}
                      setProfileSections={props.setProfileSections}
                      sectionName={section}
                      userId={props.userId}
                      setEmployee={props.setEmployee}
                    />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Modal>
  );
};

export default AddToProfileModal;
