import { TableCell } from "@mui/material";

const InlineTableCell: React.FC = ({ children }) => {
  return (
    <TableCell style={{ whiteSpace: "nowrap" }} align="right">
      {children}
    </TableCell>
  );
};

export default InlineTableCell;
