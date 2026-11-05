import { useRef, useState } from 'react';
import { Props } from './types';
import AI from 'components/icons/AI';
import { twMerge } from 'tailwind-merge';
import { Button, ShadcnTextarea } from 'components';
import { CircleCheckIcon, PencilLineIcon, SparklesIcon, XIcon } from 'lucide-react';

const RefineWithAI: React.FC<Props> = (props) => {
  const [status, setStatus] = useState<'initial' | 'idle' | 'loading' | 'done'>('initial');
  const [input, setInput] = useState('');
  const controllerRef = useRef<AbortController | null>(null);

  const handleRefine = async () => {
    setStatus('loading');

    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    const response = await props.submitHandler(input, controller, props.statuses, props.index);

    if (response.cancelled) {
      setStatus('initial');
    } else {
      setStatus('done');
    }
  };

  return (
    <div className={twMerge('w-full mb-6 text-foreground', props.isOnCard && 'mb-7')}>
      {status !== 'initial' && (
        <div className='border border-border rounded-lg p-4 shadow-xs flex-col w-full items-center justify-between'>
          <div className='flex-col items-center gap-2'>
            <div className='flex justify-between mb-4 items-center'>
              <p className='font-medium flex items-center gap-1.5 rounded-lg'>
                <AI /> How can I help you?
              </p>

              <Button
                variant='ghost'
                size='icon-sm'
                onClick={() => {
                  setStatus('initial');
                  setInput('');
                }}
              >
                <XIcon />
              </Button>
            </div>

            {status === 'idle' && (
              <div className='w-full pl-5 pr-1.5'>
                <ShadcnTextarea
                  rows={3}
                  placeholder='Add any extra instructions here...'
                  className='resize-none border-none focus-visible:ring-0 text-sm max-h-24 p-0'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                />

                <div className='text-right mt-2 w-full flex justify-end'>
                  <Button type='button' variant='link' onClick={handleRefine} className='p-0'>
                    <SparklesIcon size={16} /> Refine
                  </Button>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <p className='flex items-center gap-1.5 text-muted-foreground'>
                <PencilLineIcon size={16} />
                Rewriting...
              </p>
            )}

            {status === 'loading' && (
              <div className='flex gap-2 text-sm mt-0.5 justify-end'>
                <Button
                  type='button'
                  variant='link'
                  className='text-muted-foreground hover:text-primary p-0'
                  onClick={() => {
                    controllerRef.current?.abort();
                    setInput('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {status === 'done' && (
              <p className='flex items-center gap-1'>
                <CircleCheckIcon size={18} className='text-white fill-success rounded-full' /> Done!
              </p>
            )}
          </div>

          {status === 'done' && (
            <div className='flex gap-2 text-sm mt-0.5 justify-end'>
              <Button
                type='button'
                variant='link'
                className='text-muted-foreground hover:text-primary p-0'
                onClick={() => {
                  props.undoHandler(props.statuses);
                  setStatus('initial');
                  setInput('');
                }}
              >
                Undo
              </Button>

              <Button
                type='button'
                variant='link'
                className='text-muted-foreground hover:text-primary p-0'
                onClick={() => setStatus('idle')}
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      )}

      {status === 'initial' && !props.isOnCard && (
        <div
          className='w-full flex justify-center bg-indigo-50 px-4 py-3.5 hover:bg-indigo-100 cursor-pointer rounded-lg transition-colors'
          onClick={() => setStatus('idle')}
        >
          <Button type='button' variant='link' className='no-underline! text-foreground p-0'>
            <AI /> Refine with AI
          </Button>
        </div>
      )}

      {status === 'initial' && props.isOnCard && (
        <div className='w-full flex items-center justify-end'>
          <Button
            type='button'
            variant='link'
            className='no-underline! text-foreground p-0'
            onClick={() => setStatus('idle')}
          >
            <AI /> Refine with AI
          </Button>
        </div>
      )}
    </div>
  );
};

export default RefineWithAI;
