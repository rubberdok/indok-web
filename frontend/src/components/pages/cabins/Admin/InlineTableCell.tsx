import { TableCell } from "@mui/material";

export const InlineTableCell: React.FC = ({ children }) => {
  return (
    <TableCell style={{ whiteSpace: "nowrap" }} align="right">
      {children}
    </TableCell>
  );
};
