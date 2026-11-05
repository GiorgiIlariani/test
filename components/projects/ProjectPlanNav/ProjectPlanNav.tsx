import Link from 'next/link';
import { useProjectPlanNav } from './useProjectPlanNav';
import { twMerge } from 'tailwind-merge';
import { Menu } from 'components/icons';
import { analytics } from 'helpers';
import { Props } from './types';

const ProjectPlanNav: React.FC<Props> = (props) => {
  const { navList, togglePhase, isBurgerClicked, buttonRef, dropDownRef } = useProjectPlanNav(
    props.permissions,
  );

  return (
    <nav className='flex items-center gap-1 w-full relative'>
      {navList()
        ?.filter((el) => el.show)
        ?.map(({ href, isActive, key, label }) => (
          <Link
            key={key}
            className={twMerge(
              'text-[#5A636F] font-medium px-3 py-1 text-sm',
              isActive && 'text-indigo-600 bg-indigo-50 rounded-[4px] ',
            )}
            href={href}
            onClick={() => analytics.track(`Project nav - ${label}`)}
          >
            {label}
          </Link>
        ))}
      <button className='pl-3' onClick={togglePhase} type='button' ref={buttonRef}>
        <Menu stroke={'stroke-[#5A636F]'} size={'22'} />
      </button>
      {isBurgerClicked && (
        <ul
          className='absolute top-8 left-52 z-999 w-44 text-left overflow-hidden rounded-lg border  border-gray-300 bg-white text-sm shadow-lg'
          ref={dropDownRef}
        >
          {navList()
            ?.filter((el) => !el.show)
            ?.map((el, i) => (
              <li key={i} className='cursor-pointer px-2 py-2 transition-all hover:bg-gray-100'>
                <Link href={el.href}>{el.label}</Link>
              </li>
            ))}
        </ul>
      )}
    </nav>
  );
};

export default ProjectPlanNav;
