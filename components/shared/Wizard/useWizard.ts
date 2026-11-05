import { useRef, useState } from 'react';
import type { StepChangeContext, Stepper } from '@stepperize/react';
import type { WizardProps, WizardStep } from './types';

export function useWizard<const Steps extends readonly WizardStep[]>(
  stepperOptions: WizardProps<Steps>['stepperOptions'],
  beforeNext: WizardProps<Steps>['beforeNext'],
  beforeBack: WizardProps<Steps>['beforeBack'],
  onSubmit: WizardProps<Steps>['onSubmit'],
  submitting: WizardProps<Steps>['submitting'],
) {
  const [isWorking, setIsWorking] = useState(false);
  const workingRef = useRef(false);
  const stepperRef = useRef<Stepper<Steps> | null>(null);

  const handleBeforeStepChange = async (context: StepChangeContext<Steps>) => {
    const canChangeStep = await stepperOptions?.beforeStepChange?.(context);

    if (canChangeStep === false) return false;

    const stepper = stepperRef.current;

    if (!stepper || context.direction === 'reset') return true;

    if (context.toIndex > context.fromIndex) {
      const shouldContinue = await beforeNext?.(stepper);
      const isValid = shouldContinue !== false;

      stepper.setComplete(context.from.id, isValid);

      return isValid;
    }

    if (context.toIndex < context.fromIndex) {
      const shouldContinue = await beforeBack?.(stepper);

      return shouldContinue !== false;
    }

    return true;
  };

  const runAction = async (action: () => boolean | Promise<boolean>) => {
    const stepper = stepperRef.current;

    if (!stepper || workingRef.current || submitting || stepper.isPending) return false;

    workingRef.current = true;
    setIsWorking(true);

    try {
      return await action();
    } finally {
      workingRef.current = false;
      setIsWorking(false);
    }
  };

  const handlePrimaryAction = async () => {
    const stepper = stepperRef.current;

    if (!stepper) return;

    if (stepper.isLast) {
      if (!onSubmit) return;

      await runAction(async () => {
        const submitted = await onSubmit(stepper);

        if (submitted) stepper.setComplete(stepper.id, true);

        return submitted;
      });

      return;
    }

    if (!stepper.canNext) return;

    await runAction(() => stepper.next());
  };

  const handleBack = async () => {
    const stepper = stepperRef.current;

    if (!stepper?.canPrev) return;

    await runAction(() => stepper.prev());
  };

  return {
    isWorking,
    handleBeforeStepChange,
    handlePrimaryAction,
    handleBack,
    stepperRef,
  };
}
