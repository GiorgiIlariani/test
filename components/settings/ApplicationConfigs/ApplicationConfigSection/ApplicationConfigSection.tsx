const ApplicationConfigSection: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <div className='w-1/2'>
      {title && <h2 className='text-2xl mb-6 font-bold text-slate-900'>{title}</h2>}

      {children}
    </div>
  );
};

export default ApplicationConfigSection;
