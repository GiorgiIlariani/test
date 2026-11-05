import { Props } from './types';
import { FormProvider } from 'react-hook-form';
import {
  Modal,
  FieldGroup,
  FieldSet,
  FormCombobox,
  FormDatePicker,
  FormInput,
  FormSalaryInput,
  FormSelect,
} from 'components';

const EmploymentDetailsModal: React.FC<Props> = ({
  form,
  onSubmit,

  open,
  onOpenChange,

  canViewSalary,
  canEditLogInfo,
  isPreOffer,

  positions,
  seniorities,
  departments,

  loading,
}) => {
  return (
    <Modal
      title='Employment Details'
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      onConfirm={form.handleSubmit(onSubmit)}
    >
      <FormProvider {...form}>
        <FieldSet>
          <FieldGroup>
            <div className={canViewSalary ? 'grid grid-cols-2 gap-6' : 'grid grid-cols-1'}>
              <FormDatePicker name='join_date' label='Join Date' required />

              {canViewSalary && (
                <FormSalaryInput
                  name='salary'
                  currencyName='salary_currency'
                  label='Salary'
                  placeholder='0'
                  type='number'
                  required={isPreOffer}
                  disabled={!canEditLogInfo}
                />
              )}
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <FormInput
                name='email'
                label='Work Email'
                type='email'
                placeholder='stranger@redberry.ge'
                required
              />
              <FormSelect
                name='availability'
                label='Availability'
                placeholder='Part-time, Full-time, On-demand'
                items={[
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'On-demand', label: 'On-demand' },
                ]}
                required={isPreOffer}
                disabled={!canEditLogInfo}
              />
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <FormCombobox
                name='position_id'
                label='Position'
                placeholder='HR, Developer, Strategist...'
                required={isPreOffer}
                items={positions.map((position) => ({
                  value: position.id,
                  label: position.title,
                }))}
                disabled={!canEditLogInfo}
              />
              <FormCombobox
                name='seniority_id'
                label='Seniority'
                placeholder='Intern, Junior, Middle...'
                required={isPreOffer}
                items={seniorities.map((seniority) => ({
                  value: seniority.id,
                  label: seniority.title,
                }))}
                disabled={!canEditLogInfo}
              />
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <FormCombobox
                name='department_id'
                label='Department'
                placeholder='QA, Design, Sales...'
                items={departments.map((department) => ({
                  value: department.id,
                  label: department.title,
                }))}
                required={isPreOffer}
                disabled={!canEditLogInfo}
              />
              <FormSelect
                name='job_type'
                label='Employment Type'
                placeholder='Employee, Freelancer, Pre-offer'
                items={[
                  { value: 'employee', label: 'Employee' },
                  { value: 'freelancer', label: 'Freelancer' },
                  { value: 'pre-offer', label: 'Pre-offer' },
                ]}
                required={isPreOffer}
                disabled={!canEditLogInfo}
              />
            </div>
          </FieldGroup>
        </FieldSet>
      </FormProvider>
    </Modal>
  );
};

export default EmploymentDetailsModal;
