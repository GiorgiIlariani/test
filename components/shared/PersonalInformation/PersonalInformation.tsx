import { Card, FieldGroup, FieldSet, FormCombobox, FormInput } from 'components';
import { Props } from './types';
import { useDebouncedSearch } from 'hooks';
import { getLocations } from 'services';
import { getCookie } from 'cookies-next';

const PersonalInformation: React.FC<Props> = (props) => {
  const locationSearch = useDebouncedSearch({
    selectedValue: props.location,
    fetchItems: async (query) => {
      const response = await getLocations(getCookie('token'), query);
      return response.map((item) =>
        item.country ? `${item.city}, ${item.country.country}` : `${item.city}`,
      );
    },
    emptyText: 'Start typing to search for locations.',
    noResultsText: 'No locations found.',
  });

  return (
    <Card
      extraClasses={props.extraCardClasses}
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-2 gap-6'>
            <FormInput name='first_name' label='First Name' placeholder='John' required />

            <FormInput name='last_name' label='Last Name' placeholder='Doe' required />
          </div>

          {props.cvModal ? (
            <FormCombobox
              name='location'
              label='Location'
              placeholder='London, United Kingdom'
              inputValue={locationSearch.inputValue}
              items={locationSearch.items.map((location) => ({
                label: location,
                value: location,
              }))}
              onValueChange={() => props.setLocationIsChanged?.(true)}
              onInputValueChange={locationSearch.onInputValueChange}
              emptyText={locationSearch.emptyText}
            />
          ) : (
            <>
              <div className='grid grid-cols-2 gap-6'>
                <FormInput
                  name='id_number'
                  label='ID Number'
                  placeholder='1234567890'
                  type='number'
                />

                <FormCombobox
                  name='location'
                  label='Location'
                  placeholder='London, United Kingdom'
                  inputValue={locationSearch.inputValue}
                  items={locationSearch.items.map((location) => ({
                    label: location,
                    value: location,
                  }))}
                  onInputValueChange={locationSearch.onInputValueChange}
                  emptyText={locationSearch.emptyText}
                />
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <FormInput name='zip_code' label='ZIP Code' placeholder='12345' />

                <FormInput name='street_address' label='Address' placeholder='123 Main St.' />
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <FormInput
                  name='personal_email'
                  label='Personal Email'
                  placeholder='stranger@redberry.ge'
                  autoComplete='email'
                />

                <FormInput name='phone' label='Phone Number' placeholder='555123456' type='tel' />
              </div>
            </>
          )}
        </FieldGroup>
      </FieldSet>
    </Card>
  );
};

export default PersonalInformation;
