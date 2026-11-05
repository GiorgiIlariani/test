import { Backdrop, CircleTick, CircleCheck, ProgressCircle, X } from 'components';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { Props } from './types';

const ProjectSetupModal: React.FC<Props> = (props) => {
  return (
    <>
      <section className='w-[380px] h-[577px] bg-white z-1000 absolute bottom-[23vh] right-16 rounded-lg pt-7'>
        <section className='border-b border-gray-100 px-4.5 pb-3.5'>
          <div className='flex justify-between mb-1'>
            <h2 className='font-bold text-slate-900'>Project Setup</h2>
            <div className='p-1 rounded-full hover:bg-gray-200'>
              <X size={16} onClick={() => props.setIsOpen(false)} className='cursor-pointer' />
            </div>
          </div>

          <h3 className='text-sm text-[#5A636F] mt-1'>Guide to help you work with projects</h3>
        </section>

        <section className='px-4.5 pt-4.5 pb-4 flex gap-1 text-xs items-center'>
          <ProgressCircle
            progress={props.progress}
            baseColor='#F1F2F4'
            fillColor='#059669'
            size={0.86}
            innerSize={0.75}
            hideContent
          />
          <p>
            {props.completedFields}/{props.projectSetupFields.length}
          </p>
          <p>Step completed</p>
        </section>

        <div className='flex flex-col gap-2 px-4.5'>
          {props.projectSetupFields.map(({ heading, fields, href, isComplete }, i) => (
            <ul
              className='flex flex-col gap-2 border border-gray-100 rounded-md px-3 py-2 relative hover:bg-gray-50'
              key={i}
            >
              <div className='flex gap-2 items-center'>
                <Link
                  href={href}
                  className={twMerge(
                    'text-sm',
                    href.includes('#') ? 'cursor-default' : 'hover:underline',
                  )}
                  onClick={() => props.setIsOpen(false)}
                >
                  {heading}
                </Link>
                {fields.length ? (
                  <p className='bg-gray-100 text-xs h-5 rounded-md text-zinc-700 flex items-center justify-center px-2'>
                    {fields.filter((f) => f.isComplete).length}/{fields.length}
                  </p>
                ) : null}

                <div className='ml-auto'>
                  <CircleTick color={isComplete ? '#059669' : '#9DA1A9'} />
                </div>
              </div>
              {fields
                .sort((a, b) => Number(a.isComplete) - Number(b.isComplete))
                .map((field) => (
                  <li key={field.name} className='flex gap-2 ml-4 text-xs'>
                    <CircleCheck
                      className={twMerge(
                        '[&>path]:stroke-white w-4 h-4 z-10 stroke-transparent',
                        field.isComplete
                          ? '[&>path:first-child]:fill-[#059669]'
                          : '[&>path:first-child]:fill-[#DFE2E7]',
                      )}
                    />
                    {field.name}
                  </li>
                ))}
              <div className='absolute border-l border-zinc-200 left-[2.2rem] top-12 bottom-4 z-0' />
            </ul>
          ))}
        </div>
      </section>
      <Backdrop extraClasses='bg-neutral-900/50! z-99' onClick={() => props.setIsOpen(false)} />
    </>
  );
};

export default ProjectSetupModal;
