import { DownChevron } from 'components';
import { Props } from './types';
import { useProjectsStatusFilter } from './useProjectsStatusFilter';

const ProjectsStatusFilter: React.FC<Props> = (props) => {
  const { stateHandler, buttonRef, dropDownRef, toggleStatusFilter } = useProjectsStatusFilter(
    props.filterState,
    props.setFilterState,
    props.setIsOpen,
    props.updateProjectFilterState,
  );

  return (
    <>
      <div className='relative px-4'>
        <button
          ref={buttonRef}
          onClick={toggleStatusFilter}
          className='flex w-full items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-xs hover:bg-gray-200'
        >
          {Object.keys(props.filterState).map(
            (key) =>
              props.filterState[key] && (
                <span key={key} className='pr-2 capitalize'>
                  {key === 'pre-sale' ? 'Presale' : key}
                </span>
              ),
          )}
          <DownChevron />
        </button>
        {props.isOpen && (
          <div
            ref={dropDownRef}
            className='absolute right-4 z-999 mt-1 w-[250px] space-y-5 rounded-lg bg-white p-4 text-base shadow-lg'
          >
            {Object.keys(props.filterState).map((name) => (
              <div className='flex items-center justify-between' key={name}>
                <span className='capitalize'>{name === 'pre-sale' ? 'Presale' : name}</span>
                <input
                  type='checkbox'
                  name={name}
                  onChange={stateHandler}
                  checked={props.filterState[name]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsStatusFilter;
