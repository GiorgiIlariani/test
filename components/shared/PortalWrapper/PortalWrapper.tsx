import { usePortalWrapper } from './usePortalWrapper';
import { createPortal } from 'react-dom';
import { Props } from './types';

const PortalWrapper: React.FC<Props> = (props) => {
  const { mounted, ref } = usePortalWrapper(props.setMounted, props.className);

  return mounted && ref.current ? createPortal(props.children, ref.current) : null;
};

export default PortalWrapper;
