import { Header } from './Header';
import { Row } from './Row';
import { TableContext } from './context';
import { RootProps } from './types';
import { useTable } from './useTable';
import { Col } from './Col';

const Root = (props: RootProps) => {
  const { wrapperStyle } = useTable(props.renderColRules);

  return (
    <TableContext.Provider value={{ ...props, wrapperStyle }}>
      <section className={props.className}>{props.children}</section>
    </TableContext.Provider>
  );
};

export const Table = {
  Root,
  Header,
  Row,
  Col,
};
