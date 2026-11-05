import {
  BasicSelect,
  CircleBin,
  ErrorModal,
  Loader,
  NormalInput,
  PortalWrapper,
  TrashCan,
} from 'components';
import { allowOnlyNumbersInInputWithDot, getCurrencySymbol } from 'helpers';
import { useRateCardForm } from './useRateCardForm';
import { appendEmptyRates, removeRateCardAndCorrespondingRates, validateDecimal } from './helpers';
import CircleBinWithoutBackground from 'components/icons/CircleBinWithoutBackground';
import { twMerge } from 'tailwind-merge';

const RateCardsForm = () => {
  const {
    handleSubmit,
    reset,
    loading,
    cancelData,
    setDataChanged,
    isButtonActive,
    rateCardFields,
    rateCardAppend,
    rateCardRemove,
    positionSeniorityFields,
    positionSeniorityAppend,
    positionSenioritiesWatch,
    onSubmit,
    getRoleTitles,
    deleteModalIsOpen,
    setDeleteModalIsOpen,
    sendRateCardsToApi,
    getValues,
    setValue,
    rateCadNameShouldBeUnique,
    clearErrors,
    initialLoad,
    removePositionSenioritiesAndCorrespondingRates,
  } = useRateCardForm();

  return (
    <>
      {deleteModalIsOpen && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='You deleted the rates card - all rates from the column will be deleted.'
            modalSecondaryMessageSpan='Are you sure you want to proceed?'
            modalTitle='Warning'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => {
              reset(JSON.parse(JSON.stringify(cancelData)));
              setDataChanged(false);
              setDeleteModalIsOpen(false);
            }}
            confirmFunction={() => {
              sendRateCardsToApi(getValues());
              setDeleteModalIsOpen(false);
            }}
            isLoading={loading}
          />
        </PortalWrapper>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className='relative'>
        <div className='w-11/12 flex gap-0 border-x border-t border-x-gray-300 border-t-gray-300 rounded-tl-md rounded-tr-md'>
          <div className='border-r border-r-gray-200'>
            <div className='flex h-16 items-center pl-1  bg-indigo-50 border-b border-b-gray-200'>
              <p className='w-72 px-6 text-[#312E81] text-xs'>Role</p>
            </div>
            {(loading && initialLoad
              ? Array.from({ length: 7 }, (_, i) => i + 1)
              : positionSeniorityFields
            ).map((positionSeniority, rowIndex, array) => (
              <div key={typeof positionSeniority === 'object' ? positionSeniority.id : rowIndex}>
                <div
                  className={`h-16 flex justify-center items-center gap-2 ${
                    array.length > rowIndex + 1 && 'border-b border-b-gray-200'
                  } p-1`}
                >
                  <BasicSelect
                    inputName={`positionSeniorities.${rowIndex}.role`}
                    labelName=''
                    list={getRoleTitles()}
                    placeholder={'Enter Role'}
                    registerOptions={{
                      required: 'Role is required',
                    }}
                    doNotLeavePlaceForError
                    inputClassName='appearance-none! border-none! focus:ring-white w-72! bg-inherit! px-6! pb-0! my-0!'
                    onChangeHandler={() => {
                      setDataChanged(true);
                    }}
                    dropDownStyles={`top-10`}
                    errorStyles={'text-2xs! px-6! w-full!'}
                    loading={loading}
                    loaderStyles='w-52 mt-3 h-8 ml-3'
                  />
                </div>
              </div>
            ))}
          </div>

          <div className='w-full overflow-y-hidden flex'>
            {(loading && initialLoad
              ? Array.from({ length: 3 }, (_, i) => i + 1)
              : rateCardFields
            ).map((rateCard, index, array) => (
              <div
                key={typeof rateCard === 'object' ? rateCard.id : index}
                className={`${array.length === index + 1 ? 'w-full' : 'w-60'} ${
                  array.length > index + 1 ? 'border-r border-r-gray-200' : ''
                }`}
              >
                <div className={`w-full bg-indigo-50 border-b -mt-[0.8px]`}>
                  <div className={'flex w-full'}>
                    <div className={'text-left m-0 px-6 bg-indigo-50 flex items-center h-16'}>
                      <NormalInput
                        inputName={`rate_cards.${index}.name`}
                        placeholder={'Enter name'}
                        type={'text'}
                        className='appearance-none! placeholder:text-[#A5B4FC]! border-none outline-hidden! bg-indigo-50! w-40! text-[#312E81]! focus:ring-indigo-50! px-0! h-6! mt-5 text-xs!'
                        registerOptions={{
                          required: 'Rate card name is required',
                          minLength: {
                            value: 2,
                            message: 'Rate card name at least 2 characters',
                          },
                          maxLength: {
                            value: 255,
                            message: 'Rate card name max characters is 255',
                          },
                          validate: rateCadNameShouldBeUnique,
                        }}
                        doNotLeavePlaceForError
                        errorIconStyles='hidden'
                        externalOnChange={() => setDataChanged(true)}
                        loading={loading}
                        extraLoaderClasses='w-32 mt-5 h-8 mr-3'
                      />
                      <div
                        className={`cursor-pointer z-50 ${
                          rateCardFields.length === 1 && 'hidden'
                        } hover:opacity-50 p-1 rounded-full`}
                        onClick={() => {
                          removeRateCardAndCorrespondingRates(
                            index,
                            setValue,
                            getValues,
                            rateCardRemove,
                            clearErrors,
                          );
                          setDataChanged(true);
                        }}
                      >
                        <CircleBin className='w-[1.375rem] h-[1.375rem]' />
                      </div>
                    </div>
                  </div>
                </div>

                {(loading && initialLoad
                  ? Array.from({ length: 7 }, (_, i) => i + 1)
                  : positionSeniorityFields
                ).map((positionSeniority, rowIndex, array) => (
                  <div
                    key={`${
                      typeof positionSeniority === 'object' ? positionSeniority.id : rowIndex
                    }-${typeof rateCard === 'object' ? rateCard.id : index}`}
                    className={`text-left m-0 pl-6 pr-1 relative h-16 flex items-center ${
                      array.length > rowIndex + 1 && 'border-b border-b-gray-200'
                    } p-1`}
                  >
                    <span
                      className={`absolute top-[1.05rem] left-3 ${
                        !positionSenioritiesWatch?.[rowIndex]?.rates?.[index] && 'hidden'
                      }`}
                    >
                      {getCurrencySymbol(undefined)}
                    </span>
                    <NormalInput
                      noLabel
                      inputName={`positionSeniorities.${rowIndex}.rates[${index}]`}
                      placeholder={'Enter Hourly Rate'}
                      type={'text'}
                      registerOptions={{
                        required: 'Rate is required',
                        min: { value: 1, message: 'Rate must be at least 1' },
                        max: { value: 99999999.99, message: 'Rate max value exceeded' },
                        validate: validateDecimal,
                      }}
                      externalKeyDown={(e) => {
                        return allowOnlyNumbersInInputWithDot(e);
                      }}
                      errorIconStyles='hidden'
                      doNotLeavePlaceForError
                      className='appearance-none! border-none bg-inherit! focus:ring-white text-sm! w-48! px-0! pt-6! h-6!'
                      externalOnChange={() => {
                        setDataChanged(true);
                      }}
                      loading={loading}
                      extraLoaderClasses='w-32 mt-3 h-8 mr-3'
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className='border-l border-l-gray-200'>
            <div
              className='w-[47px] h-16 cursor-pointer flex items-center justify-center bg-indigo-50 rounded-tr-md border-b border-b-gray-200'
              onClick={() => {
                rateCardAppend({ name: '', internal_project_ids: [], budget_ids: [] });
                appendEmptyRates(getValues, setValue);
                setDataChanged(true);
              }}
            >
              <div className='w-6 h-6 rounded-full bg-white flex items-center justify-center p-2 hover:bg-gray-200'>
                <p className='text-md text-gray-500 text-left'>+</p>
              </div>
            </div>
            {(loading && initialLoad
              ? Array.from({ length: 7 }, (_, i) => i + 1)
              : positionSeniorityFields
            ).map((positionSeniority, rowIndex, array) => (
              <div
                key={typeof positionSeniority === 'object' ? positionSeniority.id : rowIndex}
                className={`h-16 flex justify-center items-center ${
                  array.length > rowIndex + 1 && 'border-b border-b-gray-200'
                }`}
              >
                <div
                  onClick={() => removePositionSenioritiesAndCorrespondingRates(rowIndex)}
                  className='flex justify-center items-center w-7 h-7 cursor-pointer rounded-full bg-[#F1F2F4] mb-1 hover:bg-gray-300 p-1'
                  onClickCapture={() => setDataChanged(true)}
                >
                  <CircleBinWithoutBackground className='w-5 h-5' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type='button'
          className='w-11/12 text-gray-400 text-left px-6 py-2 border border-t-gray-200 border-b-gray-300 border-x-gray-300 rounded-bl-md rounded-br-md hover:bg-gray-200 hover:text-gray-600'
          onClick={() => {
            positionSeniorityAppend({ role: '', rates: [] });
            setDataChanged(true);
          }}
        >
          + Add Row
        </button>

        <div className='flex gap-4 mt-6 w-44 pb-8'>
          <button
            type='button'
            disabled={!isButtonActive}
            onClick={() => {
              reset(JSON.parse(JSON.stringify(cancelData)));
              setDataChanged(false);
            }}
            className={twMerge(
              'flex w-[48%] disabled:bg-[#DFE2E7] disabled:text-white items-center justify-center rounded-md border border-gray-300 bg-white py-2 font-medium shadow-xs ring-indigo-500 ring-offset-1 ring-offset-white transition-all',
              isButtonActive && 'hover:bg-gray-200',
            )}
          >
            Cancel
          </button>

          <div className='w-20 h-11 flex items-center justify-center'>
            <button
              disabled={!isButtonActive}
              className={twMerge(
                `h-full w-full  items-center gap-2 disabled:bg-[#DFE2E7] rounded-md  flex justify-center border border-gray-300 bg-indigo-600  font-medium text-white shadow-xs ring-indigo-500 ring-offset-1 ring-offset-white transition-all focus:ring-2`,
                isButtonActive && 'hover:bg-indigo-800',
              )}
            >
              Save
              {loading && isButtonActive && <Loader size='16px' border='2px' />}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default RateCardsForm;
