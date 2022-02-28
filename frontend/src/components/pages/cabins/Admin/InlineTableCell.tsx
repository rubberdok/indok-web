import { TableCell } from "@material-ui/core";

type TableCellProps = {
  children: React.ReactNode;
};

const InlineTableCell: React.FC<TableCellProps> = ({ children }) => {
  return (
    <TableCell style={{ whiteSpace: "nowrap" }} align="right">
      {children}
    </TableCell>
  );
};

export default InlineTableCell;
