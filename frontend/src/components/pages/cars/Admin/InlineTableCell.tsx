import { TableCell } from "@mui/material";

export const InlineTableCell: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <TableCell style={{ whiteSpace: "nowrap" }} align="right">
      {children}
    </TableCell>
  );
};
