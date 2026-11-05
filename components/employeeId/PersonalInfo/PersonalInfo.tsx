import { Props } from './types';
import React from 'react';
import { usePersonalInfo } from './usePersonalInfo';
import {
  Modal,
  PersonalInformation,
  ProfileInfoSectionItems,
  ProfileInfoSectionWrapper,
} from 'components';
import { FormProvider } from 'react-hook-form';

const PersonalInfo: React.FC<Props> = (props) => {
  const { form, onSubmit, setModalOpen, isModalOpen, loading } = usePersonalInfo(
    props.employee,
    props.refetchEmployeeData,
  );

  return (
    <ProfileInfoSectionWrapper
      sectionName='Personal information'
      isEmpty={false}
      toggleModal={() => setModalOpen(true)}
      employeeId={props.employee.id}
    >
      <Modal
        title='Personal Information'
        open={isModalOpen}
        onOpenChange={setModalOpen}
        loading={loading}
        onConfirm={form.handleSubmit(onSubmit)}
      >
        <FormProvider {...form}>
          <PersonalInformation location={form.watch('location')!} />
        </FormProvider>
      </Modal>

      <section className='flex gap-8'>
        <section className='flex flex-col w-1/2 text-sm'>
          <ProfileInfoSectionItems title='First name' value={props.employee.first_name} />
          <ProfileInfoSectionItems title='ID number' value={props.employee.id_number} />
          <ProfileInfoSectionItems title='Zip code' value={props.employee.zip_code?.toString()!} />
          <ProfileInfoSectionItems
            title='Personal email'
            value={props.employee.personal_email}
            valueClassName='lowercase!'
          />
        </section>

        <section className='flex flex-col w-1/2 text-sm'>
          <ProfileInfoSectionItems title='Last name' value={props.employee.last_name} />
          <ProfileInfoSectionItems title='Location' value={props.employee.location} />
          <ProfileInfoSectionItems title='Address' value={props.employee.street_address} />
          <ProfileInfoSectionItems title='Phone number' value={props.employee.phone} />
        </section>
      </section>
    </ProfileInfoSectionWrapper>
  );
};

export default PersonalInfo;
