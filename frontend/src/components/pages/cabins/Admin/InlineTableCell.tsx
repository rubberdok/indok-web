import { TableCell } from "@material-ui/core";

const InlineTableCell: React.FC = ({ children }) => {
  return (
    <TableCell style={{ whiteSpace: "nowrap" }} align="right">
      {children}
    </TableCell>
  );
};

export default InlineTableCell;
