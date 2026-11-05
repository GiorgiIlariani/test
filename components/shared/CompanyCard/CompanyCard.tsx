import React from 'react';
import { Card, Company, Button, FormSwitch } from 'components';
import { Props } from './types';
import { useCompanyCard } from './useCompanyCard';
import { useEmploymentTypeAndIndustries } from 'hooks';
import { CirclePlusIcon } from 'lucide-react';

const CompanyCard: React.FC<Props> = (props) => {
  const { addCompanyCountHandler, remove, fields, setValue } = useCompanyCard();
  const { employmentType, industry } = useEmploymentTypeAndIndustries();
  return (
    <Card
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      {props.cvModal && !props.canNotEdit && (
        <FormSwitch
          name='showAllExperienceYears'
          label='Show years'
          onCheckedChange={(checked) =>
            fields.map((_, i) => setValue(`experiences.${i}.is_preferred`, checked))
          }
          wrapperClassName='w-fit mb-6'
        />
      )}

      {fields.map((company, i) => (
        <Company
          canNotEdit={props.canNotEdit}
          key={company.experience_id ?? company.id}
          defaultValues={props.defaultValues}
          index={i}
          remove={remove}
          setRemovedItems={props.setRemovedItems}
          id={+company.experience_id!}
          industry={industry!}
          employmentType={employmentType!}
          enhanceCvWithAi={props.enhanceCvWithAi}
          undoAiHandler={props.undoAiHandler}
        />
      ))}

      {!props.canNotEdit && (
        <div className='flex justify-end w-full'>
          <Button type='button' variant='default-outline' onClick={addCompanyCountHandler}>
            <CirclePlusIcon />
            Add new experience
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CompanyCard;
