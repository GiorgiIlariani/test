import { useObserver } from 'hooks';

const Anima = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const { ref } = useObserver<HTMLDivElement>();
  return (
    <div ref={ref} className={`transition-all duration-300 delay-200 ${className}`}>
      {children}
    </div>
  );
};

export default Anima;
