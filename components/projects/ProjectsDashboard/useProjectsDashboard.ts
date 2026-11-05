export const useProjectsDashboard = () => {
  const headers = [
    { title: 'Project name', className: 'col-span-3' },
    { title: 'Dates', className: 'col-span-2' },
    { title: 'Status', className: 'col-span-1' },
    { title: 'Current phases', className: 'col-span-3' },
    { title: 'Project revenue', className: 'col-span-3' },
    { title: 'Owner', className: 'col-span-2' },
  ];
  return { headers };
};
