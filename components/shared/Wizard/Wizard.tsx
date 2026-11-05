import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, LoaderCircleIcon } from 'lucide-react';

import { cn } from 'lib';
import { Button } from '../Button';
import type { WizardProps, WizardStep } from './types';
import { useWizard } from './useWizard';

function Wizard<const Steps extends readonly WizardStep[]>({
  definition,
  children,
  orientation = 'horizontal',
  stepperOptions,
  beforeNext,
  beforeBack,
  onSubmit,
  backLabel = 'Previous Step',
  nextLabel = 'Next Step',
  submitLabel = 'Complete',
  submitting = false,
  classNames,
  ...rootProps
}: WizardProps<Steps>) {
  const { Stepper } = definition;

  const { isWorking, handleBeforeStepChange, handlePrimaryAction, handleBack, stepperRef } =
    useWizard<Steps>(stepperOptions, beforeNext, beforeBack, onSubmit, submitting);

  return (
    <Stepper.Root
      {...stepperOptions}
      orientation={orientation}
      linear={stepperOptions?.linear ?? true}
      beforeStepChange={handleBeforeStepChange}
      className='flex min-h-0 flex-col'
    >
      {({ stepper }) => {
        stepperRef.current = stepper;

        const isBusy = submitting || isWorking || stepper.isPending;

        return (
          <div
            data-slot='wizard'
            className={cn('flex min-h-0 flex-col', classNames?.root)}
            {...rootProps}
          >
            <div
              data-orientation={orientation}
              className='flex min-h-0 flex-col data-[orientation=vertical]:grid data-[orientation=vertical]:grid-cols-[fit-content(15rem)_minmax(0,1fr)]'
            >
              <Stepper.List
                orientation={orientation}
                className={cn(
                  'p-4 group/stepper-nav flex w-full min-w-0',
                  'data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:border-b data-[orientation=horizontal]:items-center',
                  'data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r data-[orientation=vertical]:items-start',
                  classNames?.list,
                )}
              >
                <Stepper.Items>
                  {(step, index) => {
                    const status = stepper.status(step.id);
                    const isComplete = stepper.isComplete(step.id);
                    const isLastStep = index === stepper.count - 1;

                    return (
                      <Stepper.Item
                        key={step.id}
                        step={step.id}
                        data-state={status}
                        data-complete={isComplete}
                        className={cn(
                          'group/step flex justify-center relative',
                          'group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=horizontal]/stepper-nav:items-center group-data-[orientation=horizontal]/stepper-nav:not-last:flex-1',
                          'group-data-[orientation=vertical]/stepper-nav:flex-col group-data-[orientation=vertical]/stepper-nav:items-start group-data-[orientation=vertical]/stepper-nav:min-w-0 group-data-[orientation=vertical]/stepper-nav:w-full',
                          classNames?.item,
                        )}
                      >
                        <Stepper.Trigger
                          disabled={isBusy}
                          data-state={status}
                          className={cn(
                            'cursor-pointer min-w-0 max-w-full items-center outline-none rounded-full flex justify-start gap-1.5',
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:z-10 focus-visible:ring-3',
                            'disabled:pointer-events-none disabled:opacity-60',
                            classNames?.trigger,
                          )}
                        >
                          <Stepper.Indicator
                            data-state={status}
                            data-complete={isComplete}
                            className={cn(
                              'border-background bg-accent text-accent-foreground flex shrink-0 items-center justify-center text-xs relative isolate size-6 overflow-visible rounded-full',
                              'before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-full before:border before:border-dashed before:border-transparent before:content-[""]',
                              'data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-0 data-[state=active]:before:animate-[spin_8s_linear_infinite] data-[state=active]:before:border-primary motion-reduce:data-[state=active]:before:animate-none',
                              'data-[state=upcoming]:border-border data-[state=upcoming]:bg-muted data-[state=upcoming]:text-foreground',
                              'data-[complete=true]:text-primary-foreground data-[complete=true]:bg-primary',
                              classNames?.indicator,
                            )}
                          >
                            {isComplete ? <CheckIcon className='size-3.5' /> : index + 1}
                          </Stepper.Indicator>

                          <Stepper.Title
                            title={typeof step.title === 'string' ? step.title : undefined}
                            data-state={status}
                            className={cn(
                              'font-medium text-sm',
                              'min-w-0 group-data-[orientation=vertical]/stepper-nav:truncate',
                              'group-data-[state=upcoming]/step:text-foreground',
                              classNames?.title,
                            )}
                          >
                            {step.title}
                          </Stepper.Title>
                        </Stepper.Trigger>

                        {!isLastStep && (
                          <Stepper.Separator
                            orientation={orientation}
                            className={cn(
                              'rounded-full bg-border',
                              'group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1 group-data-[orientation=horizontal]/stepper-nav:mx-2.5',
                              'group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:w-0.5 group-data-[orientation=vertical]/stepper-nav:my-1.5 group-data-[orientation=vertical]/stepper-nav:ml-2.75',
                              'group-data-[complete=true]/step:bg-primary',
                              classNames?.separator,
                            )}
                          />
                        )}
                      </Stepper.Item>
                    );
                  }}
                </Stepper.Items>
              </Stepper.List>

              <Stepper.Content
                step={stepper.id}
                className={cn('p-4 min-w-0 w-full overflow-y-auto', classNames?.content)}
              >
                {children(stepper)}
              </Stepper.Content>
            </div>

            <Stepper.Actions
              className={cn(
                'p-4 items-center flex justify-end gap-2 border-t',
                classNames?.actions,
              )}
            >
              {stepper.canPrev && (
                <Button type='button' variant='outline' disabled={isBusy} onClick={handleBack}>
                  <ArrowLeftIcon data-icon='inline-start' />
                  {backLabel}
                </Button>
              )}

              <Button type='button' disabled={isBusy} onClick={handlePrimaryAction}>
                {isBusy && <LoaderCircleIcon className='animate-spin' data-icon='inline-start' />}
                {stepper.isLast ? submitLabel : nextLabel}
                {!stepper.isLast && !isBusy && <ArrowRightIcon data-icon='inline-end' />}
              </Button>
            </Stepper.Actions>
          </div>
        );
      }}
    </Stepper.Root>
  );
}

export default Wizard;
