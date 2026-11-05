import { serviceList } from 'helpers';
import {
  Invoices,
  ProjectsService,
  EmployeeService,
  TrafficServices,
  ReportServices,
  Anima,
} from 'components';
import { VacationServices } from 'components';
import { useServices } from './useServices';

const Services = () => {
  const {
    selectedService,
    scrollToSection,
    employeeRef,
    projectsRef,
    invoicesRef,
    trafficRef,
    reportsRef,
    vacationsRef,
    setListen,
  } = useServices();
  return (
    <section className='bg-white text-olive-800 w-full pt-21.5  gap-20  relative '>
      <section className='pl-24  sticky top-0 bg-white pb-2 z-999999'>
        <ol className='gap-4 flex-wrap items-center py-4 justify-center hidden lg:flex'>
          {serviceList.map((item, i) => (
            <li
              key={item.title}
              className={`${
                serviceList[selectedService].title === item.title
                  ? 'text-indigo-400  border-indigo-400'
                  : 'border-zinc-200 text-black'
              } rounded-[30px] text-center border text-sm leading-5  py-3 px-4 cursor-pointer`}
              onClick={() => scrollToSection(item.title, i)}
            >
              {item.title}
            </li>
          ))}
        </ol>
      </section>
      <div className='flex flex-col gap-[70px]' onMouseEnter={() => setListen(true)}>
        <Anima>
          <EmployeeService refs={employeeRef} />
        </Anima>
        <Anima>
          <ProjectsService refs={projectsRef} />
        </Anima>
        <Anima>
          <Invoices refs={invoicesRef} />
        </Anima>
        <Anima>
          <TrafficServices refs={trafficRef} />
        </Anima>
        <Anima>
          <ReportServices refs={reportsRef} />
        </Anima>
        <Anima>
          <VacationServices refs={vacationsRef} />
        </Anima>
      </div>
    </section>
  );
};

export default Services;
