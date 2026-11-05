import {
  FileUploadWithPreview,
  NormalInput,
  BasicSelect,
  YearsDropDown,
  Loader,
  CommonDropdown,
  FileUploader,
  DeleteX,
  VatCreationSection,
} from 'components';
import { getLocationDropDownHeight } from 'helpers';
import { truncateString } from 'helpers';
import { PublicHolidaysTable } from '../PublicHolidaysTable';
import { useEmployeeLocation, useOrganizationConfigs } from 'hooks';

const OrganizationConfigsForm = () => {
  const { getLocationsHandler, input, locations } = useEmployeeLocation('location');
  const {
    currentYear,
    selectYearHandler,
    modalIsOpen,
    countries,
    selectedCountry,
    handleSubmit,
    onSubmit,
    loading,
    isButtonActive,
    data,
    changeCountry,
    setModalIsOpen,
    holidays,
    setHolidays,
    setDataChanged,
    isLoading,
    customError,
    setCustomError,
    fields,
    append,
    remove,
    getValues,
    showRequiredErrorMessage,
    cancelHandler,
  } = useOrganizationConfigs();

  return (
    <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-4'>
        <p className='font-medium  text-slate-900'>Organization logo</p>
        <FileUploadWithPreview
          inputName={'administrative_information.logo'}
          className='w-1/2'
          imageSrc={data?.logo!}
          externalOnChange={() => setDataChanged(true)}
          loading={loading}
          customError={customError}
          setCustomError={setCustomError}
        />
      </div>
      <div>
        <section className='flex flex-col gap-4'>
          <p className='font-medium text-slate-900'>Administrative information</p>
          <div className='w-1/2 flex flex-col'>
            <div className='flex gap-6'>
              <NormalInput
                labelName={'Organization *'}
                inputName={'administrative_information.organization'}
                placeholder={'Enter organization'}
                type={'text'}
                registerOptions={{
                  required: 'Organization is required',
                  minLength: { value: 2, message: 'Organization at least 2 characters' },
                  maxLength: { value: 255, message: 'Organization max characters is 255' },
                }}
                externalOnChange={() => setDataChanged(true)}
                loading={loading}
              />
              <NormalInput
                labelName={'LLC Name *'}
                inputName={'administrative_information.legal_name'}
                placeholder={'Enter LLC Name'}
                type={'text'}
                registerOptions={{
                  required: 'LLC Name is required',
                  minLength: { value: 2, message: 'LLC Name at least 2 characters' },
                  maxLength: { value: 255, message: 'LLC Name max characters is 255' },
                }}
                externalOnChange={() => setDataChanged(true)}
                loading={loading}
              />
            </div>
            <div className='flex gap-6'>
              <BasicSelect
                inputName='administrative_information.location'
                labelName='Location'
                list={input ? locations : []}
                onChangeHandler={(e) => {
                  getLocationsHandler(e);
                  setDataChanged(true);
                }}
                externalOptionTextRenderer={(value) => (
                  <p>{truncateString(value.toString(), 38)}</p>
                )}
                dropDownStyles={`h-${getLocationDropDownHeight(locations, 200)}`}
                placeholder='Enter Location'
                loading={loading}
              />
              <NormalInput
                labelName={'Address'}
                inputName={'administrative_information.address'}
                placeholder={'Enter Address'}
                type={'text'}
                externalOnChange={() => setDataChanged(true)}
                loading={loading}
              />
            </div>
            <div className='flex w-[48%]'>
              <NormalInput
                labelName={'Tax ID *'}
                inputName={'administrative_information.tax_id'}
                placeholder={'Enter Tax ID'}
                type={'text'}
                registerOptions={{
                  required: 'Tax ID is required',
                  minLength: { value: 2, message: 'Tax ID at least 2 characters' },
                  maxLength: { value: 255, message: 'Tax ID max characters is 255' },
                }}
                externalOnChange={() => setDataChanged(true)}
                loading={loading}
              />
            </div>

            {fields?.map((account, index) => (
              <div className='flex gap-6 items-center group-hover relative' key={account.id}>
                <NormalInput
                  labelName={'Bank Code *'}
                  inputName={`administrative_information.accounts.${index}.bank_code`}
                  placeholder={'Enter Bank Code'}
                  type={'text'}
                  registerOptions={{
                    required: 'Tax ID is required',
                    minLength: { value: 2, message: 'Bank Code at least 2 characters' },
                    maxLength: { value: 255, message: 'Bank Code max characters is 255' },
                  }}
                  externalOnChange={() => setDataChanged(true)}
                  loading={loading}
                />
                <NormalInput
                  labelName={'Account Number *'}
                  inputName={`administrative_information.accounts.${index}.account_number`}
                  placeholder={'Enter Account Number'}
                  type={'text'}
                  registerOptions={{
                    required: 'Account Number is required',
                    minLength: { value: 2, message: 'Account Number at least 2 characters' },
                    maxLength: { value: 255, message: 'Account Number max characters is 255' },
                  }}
                  externalOnChange={() => setDataChanged(true)}
                  loading={loading}
                />
                <div
                  onClick={() => {
                    remove(index);
                    setDataChanged(true);
                  }}
                  className={`${
                    getValues('administrative_information.accounts')?.length > 1 ? '' : 'hidden'
                  } absolute -right-8 top-1/2 -translate-y-1/2 cursor-pointer`}
                >
                  <DeleteX classNames='h-3 w-3' />
                </div>
              </div>
            ))}
            <button
              type='button'
              onClick={() => {
                append({ bank_code: '', account_number: '' });
                setDataChanged(true);
              }}
              className='border-2 border-[#DFE2E7] border-dashed text-center w-full px-10 py-3 rounded-md font-medium hover:bg-gray-200'
            >
              Add another Bank Information
            </button>
          </div>
        </section>
        <section className='flex flex-col gap-4 my-16'>
          <p className='font-medium text-slate-900'>Signature</p>
          <div className='w-1/2 flex flex-col'>
            <div className='flex gap-6'>
              <NormalInput
                labelName={'Position *'}
                inputName={'administrative_information.signatory_position'}
                placeholder={'Enter position'}
                type={'text'}
                registerOptions={{
                  required: 'Signatory position is required',
                  minLength: { value: 2, message: 'Position at least 2 characters' },
                  maxLength: { value: 255, message: 'Position max characters is 255' },
                }}
                externalOnChange={() => setDataChanged(true)}
                loading={loading}
              />
              <NormalInput
                labelName={'Name *'}
                inputName={'administrative_information.signatory_name'}
                placeholder={'Enter Name'}
                type={'text'}
                registerOptions={{
                  required: 'Signatory Name is required',
                  minLength: { value: 2, message: 'Name at least 2 characters' },
                  maxLength: { value: 255, message: 'Name max characters is 255' },
                }}
                externalOnChange={() => setDataChanged(true)}
                loading={loading}
              />
            </div>
            <FileUploader
              labelName={''}
              inputName={`administrative_information.signature`}
              allowedMimeTypes={['image/*']}
              inputClasses='h-28!'
              wrapperClassNames='flex flex-col'
              canDownload
              isLoading={loading}
              externalOnChangeHandler={() => setDataChanged(true)}
              externalOnFileDelete={() => setDataChanged(true)}
              showRequiredErrorMessage={showRequiredErrorMessage}
            />
          </div>
        </section>
        <section>
          <p className='font-medium pb-4  text-slate-900'>Create VAT</p>
          <VatCreationSection loading={loading} setDataChanged={setDataChanged} />
        </section>

        <section>
          <p className='font-medium pb-4  text-slate-900'>Public holidays</p>
          <div className='flex gap-4'>
            <CommonDropdown
              setModalIsOpen={setModalIsOpen}
              selectedItem={selectedCountry}
              modalIsOpen={modalIsOpen}
              list={countries}
              selectItemHandler={changeCountry as (item: string | number) => void}
              className='w-36'
              boxClassName='w-36'
            />
            <YearsDropDown
              selectYearHandler={selectYearHandler}
              currentYear={currentYear}
              page='Organization'
            />
          </div>

          <PublicHolidaysTable
            currentYear={currentYear}
            holidays={holidays}
            setHolidays={setHolidays}
            isLoading={isLoading || loading}
          />
          <div className='flex items-center gap-4 w-full pb-8'>
            <button
              type='button'
              className='px-3 py-2 border border-zinc-200 rounded-md hover:bg-gray-200'
              disabled={loading}
              onClick={cancelHandler}
            >
              Cancel
            </button>

            {loading ? (
              <div>
                <Loader size='16px' border='2px' />
              </div>
            ) : (
              <button
                type='submit'
                className='bg-indigo-600 px-8 py-[9px] text-white rounded-md  disabled:bg-[#DFE2E7] hover:bg-indigo-800'
                disabled={!isButtonActive}
              >
                Save
              </button>
            )}
          </div>
        </section>
      </div>
    </form>
  );
};

export default OrganizationConfigsForm;
