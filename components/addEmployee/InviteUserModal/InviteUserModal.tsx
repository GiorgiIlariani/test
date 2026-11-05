import { Props } from './types';
import React from 'react';
import { useInviteUserModal } from './useInviteUserModal';
import {
  Modal,
  FieldSet,
  FieldGroup,
  FormInput,
  FormSelect,
  FieldLegend,
  FieldSeparator,
  FormCombobox,
  FormDatePicker,
  FormSalaryInput,
} from 'components';
import { FormProvider } from 'react-hook-form';
import { DECIMAL_NUMBER_REGEX, EMAIL_REGEX } from 'config';
import {
  validateThatDateIsSane,
  validateThatEmployeeDoesNotHaveOnDemandAvailability,
} from 'helpers';

const InviteUserModal: React.FC<Props> = ({
  roles,
  inviteUserModalIsOpen,
  setInviteUserModalIsOpen,
  getUsers,
}) => {
  const {
    form,
    onSubmit,
    positions,
    seniorities,
    departments,
    isSubmitting,
    handleGrossSalaryChange,
    handleNetSalaryChange,
  } = useInviteUserModal(setInviteUserModalIsOpen, getUsers);

  return (
    <Modal
      title='Invite User'
      open={inviteUserModalIsOpen}
      onOpenChange={setInviteUserModalIsOpen}
      onConfirm={form.handleSubmit(onSubmit)}
      confirmButtonText='Send'
      closeButtonText='Cancel'
      submitting={isSubmitting}
    >
      <FormProvider {...form}>
        <form noValidate>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Personal Information</FieldLegend>

              <FieldGroup>
                <div className='grid grid-cols-2 gap-6'>
                  <FormInput
                    name='first_name'
                    label='First name'
                    placeholder='John'
                    rules={{
                      required: 'Enter a first name.',
                      maxLength: {
                        message: 'First name must be 32 characters or fewer.',
                        value: 32,
                      },
                      minLength: {
                        message: 'First name must be at least 2 characters.',
                        value: 2,
                      },
                    }}
                    required
                  />

                  <FormInput
                    name='last_name'
                    label='Last name'
                    placeholder='Doe'
                    rules={{
                      required: 'Enter a last name.',
                      maxLength: {
                        message: 'Last name must be 32 characters or fewer.',
                        value: 32,
                      },
                      minLength: {
                        message: 'Last name must be at least 2 characters.',
                        value: 2,
                      },
                    }}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <FormInput
                    name='email'
                    label='Email'
                    placeholder='johndoe@example.com'
                    type='email'
                    rules={{
                      maxLength: {
                        message: 'Email must be 64 characters or fewer.',
                        value: 64,
                      },
                      pattern: {
                        value: EMAIL_REGEX,
                        message: 'Enter a valid email address.',
                      },

                      required: 'Enter an email address.',
                    }}
                    required
                  />

                  <FormSelect
                    name='role'
                    label='Role'
                    placeholder='Admin'
                    items={roles.map((role) => ({
                      value: role.id,
                      label: role.name,
                    }))}
                    rules={{
                      required: 'Select a role.',
                    }}
                    required
                  />
                </div>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Employment Details</FieldLegend>

              <FieldGroup>
                <div className='grid grid-cols-2 gap-6'>
                  <FormDatePicker
                    name='join_date'
                    label='Join date'
                    placeholder='July 1st, 2026'
                    rules={{
                      required: 'Select a join date.',
                      validate: validateThatDateIsSane,
                    }}
                    required
                  />

                  <FormCombobox
                    name='position_id'
                    label='Position'
                    placeholder='Developer'
                    emptyText='No positions found.'
                    items={positions.map((position) => ({
                      value: position.id,
                      label: position.title,
                    }))}
                    rules={{
                      required: 'Select a position.',
                    }}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <FormCombobox
                    name='department_id'
                    label='Department'
                    placeholder='HR'
                    emptyText='No departments found.'
                    items={departments.map((department) => ({
                      value: department.id,
                      label: department.title,
                    }))}
                    rules={{
                      required: 'Select a department.',
                    }}
                    required
                  />

                  <FormSelect
                    name='job_type'
                    label='Employment type'
                    placeholder='Employee'
                    items={[
                      {
                        value: 'employee',
                        label: 'Employee',
                      },
                      {
                        value: 'freelancer',
                        label: 'Freelancer',
                      },
                      {
                        value: 'pre-offer',
                        label: 'Pre-offer',
                      },
                    ]}
                    onChangeHandler={() =>
                      form.getValues('availability') && form.trigger('availability')
                    }
                    rules={{
                      required: 'Select an employment type.',
                      validate: (jobType) => {
                        return validateThatEmployeeDoesNotHaveOnDemandAvailability(
                          form.getValues('availability'),
                          jobType,
                        );
                      },
                    }}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <FormSelect
                    name='availability'
                    label='Availability'
                    placeholder='Full-time'
                    items={[
                      {
                        value: 'Full-time',
                        label: 'Full-time',
                      },
                      {
                        value: 'Part-time',
                        label: 'Part-time',
                      },
                      {
                        value: 'On-demand',
                        label: 'On-demand',
                      },
                    ]}
                    onChangeHandler={() => form.getValues('job_type') && form.trigger('job_type')}
                    rules={{
                      required: {
                        message: 'Select availability.',
                        value: true,
                      },
                      validate: (availability) => {
                        return validateThatEmployeeDoesNotHaveOnDemandAvailability(
                          availability,
                          form.getValues('job_type'),
                        );
                      },
                    }}
                    required
                  />

                  <FormCombobox
                    name='seniority_id'
                    label='Seniority'
                    placeholder='Junior - Tier 1'
                    emptyText='No seniorities found.'
                    items={seniorities.map((seniority) => ({
                      value: seniority.id,
                      label: seniority.title,
                    }))}
                    rules={{
                      required: 'Select a seniority.',
                    }}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <FormSelect
                    name='payment_type'
                    label='Payment type'
                    placeholder='Monthly'
                    items={[
                      {
                        value: 'monthly',
                        label: 'Monthly',
                      },
                      {
                        value: 'hourly',
                        label: 'Hourly',
                      },
                    ]}
                    rules={{
                      required: 'Select a payment type.',
                    }}
                    required
                  />

                  <FormSalaryInput
                    name='salary'
                    currencyName='salary_currency'
                    label={`Gross ${
                      form.watch('payment_type') === 'hourly' ? 'hourly' : 'monthly'
                    } salary`}
                    info={`Dependent on net ${
                      form.watch('payment_type') === 'hourly' ? 'hourly' : 'monthly'
                    } salary and vice versa. Updating either value will automatically recalculate the other.`}
                    placeholder='0'
                    externalOnChange={handleGrossSalaryChange}
                    rules={{
                      required: 'Enter a salary.',
                      validate: (value) =>
                        DECIMAL_NUMBER_REGEX.test(String(value)) || 'Salary must be a number.',
                      max: {
                        message: 'Salary cannot exceed 40,000',
                        value: 40000,
                      },
                    }}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <FormSalaryInput
                    name='net_salary'
                    currencyName='salary_currency'
                    hideCurrencySelect
                    label={`Net ${
                      form.watch('payment_type') === 'hourly' ? 'hourly' : 'monthly'
                    } salary`}
                    info={`Dependent on gross ${
                      form.watch('payment_type') === 'hourly' ? 'hourly' : 'monthly'
                    } salary and vice versa. Updating either value will automatically recalculate the other.`}
                    placeholder='0'
                    externalOnChange={handleNetSalaryChange}
                    rules={{
                      validate: (value) =>
                        !value ||
                        DECIMAL_NUMBER_REGEX.test(String(value)) ||
                        'Net salary must be a number.',
                    }}
                  />
                </div>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default InviteUserModal;
