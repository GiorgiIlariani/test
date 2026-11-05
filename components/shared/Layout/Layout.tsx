import {
  NoSSR,
  ImpersonationBanner,
  ShadcnSidebarProvider,
  AppSidebar,
  ShadcnSidebarTrigger,
  ShadcnSidebarInset,
  SearchFilter,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  NotificationCenter,
  ErrorPage,
  Loader,
  UserMenu,
} from 'components';
import { useLayout } from './useLayout';
import { Props } from './types';
import { memo } from 'react';
import { cn } from 'lib';
import { Currency } from 'types';

const Layout: React.FC<Props> = memo((props) => {
  const {
    isImpersonating,
    user,
    handleCancelImpersonate,
    currencyConfig,
    selectedCurrency,
    currencyChangeHandler,
    currencyIsLoading,
    hideCurrencyInput,
    isLoading,
  } = useLayout(props.setCurrency, props.externalCurrencyChangeHandler);

  return (
    <NoSSR>
      <div className='flex h-dvh flex-col'>
        {isImpersonating && (
          <ImpersonationBanner impersonatedUserName={user.name} onExit={handleCancelImpersonate} />
        )}

        <ShadcnSidebarProvider
          open={true}
          forceMobile={props.drawerSidebar}
          className='min-h-0 flex-1'
        >
          <AppSidebar
            className={isImpersonating ? 'top-13.5 h-[calc(100svh-3.375rem)]' : undefined}
            permissions={props.permissions}
          />

          <ShadcnSidebarInset className={props.containerClassName}>
            {!props.disableHeader && (
              <header className='flex h-16 md:h-18 shrink-0 items-center gap-2 border-b bg-background px-4 sm:px-6 lg:px-8'>
                <ShadcnSidebarTrigger className={props.drawerSidebar ? undefined : 'md:hidden'} />

                {props.searchable &&
                  props.dispatchEmployeeInfo &&
                  props.filterOptions &&
                  props.allSubCategories &&
                  props.topCategories &&
                  props.filterText && (
                    <SearchFilter
                      dispatchEmployeeInfo={props.dispatchEmployeeInfo}
                      allSubCategories={props.allSubCategories}
                      topCategories={props.topCategories}
                      filterOptions={props.filterOptions}
                      entireArrayOfFieldBeingGroupedByTier={
                        props.entireArrayOfFieldBeingGroupedByTier
                      }
                      refetchSubCategories={props.refetchSubCategories}
                      filterText={props.filterText}
                      filterSaving={props.filterSaving}
                      setSavedFiltersState={props.setSavedFiltersState}
                    />
                  )}

                <div className='ml-auto flex items-center gap-2'>
                  {!hideCurrencyInput && (
                    <Select
                      items={currencyConfig.all_currencies.map((currency) => ({
                        value: currency,
                        label: currency,
                      }))}
                      value={selectedCurrency || null}
                      onValueChange={(value) => currencyChangeHandler(value as Currency)}
                      disabled={isLoading || currencyIsLoading}
                    >
                      <SelectTrigger aria-label='Currency' className='ml-auto shrink-0'>
                        <SelectValue placeholder='Currency' />
                      </SelectTrigger>

                      <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                          {currencyConfig.all_currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}

                  <NotificationCenter />

                  <div className='hidden md:grid'>
                    <UserMenu />
                  </div>
                </div>
              </header>
            )}

            <div
              id='layout-content'
              className={cn(
                'flex flex-1 flex-col overflow-auto bg-[#FBFBFB] p-4 sm:p-6 lg:p-8',
                props.parentClass,
              )}
            >
              {props.notResponseError ? (
                <ErrorPage setNotResponseError={props.setNotResponseError!} />
              ) : props.disableLoading || !isLoading ? (
                props.children
              ) : (
                <div className='flex w-full flex-1 items-center justify-center'>
                  <Loader size='100px' border='8px' />
                </div>
              )}
            </div>
          </ShadcnSidebarInset>
        </ShadcnSidebarProvider>
      </div>
    </NoSSR>
  );
});

Layout.displayName = 'Layout';

export default Layout;
