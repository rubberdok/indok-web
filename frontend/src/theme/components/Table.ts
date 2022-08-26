import { ThemeOptions } from "@mui/material";

const Table: ThemeOptions["components"] = {
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-selected": {
          backgroundColor: theme.palette.action.selected,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: "none",
      },
      head: ({ theme }) => ({
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.paper,
        "&:first-of-type": {
          paddingLeft: theme.spacing(3),
          borderTopLeftRadius: theme.shape.borderRadius,
          borderBottomLeftRadius: theme.shape.borderRadius,
        },
        "&:last-of-type": {
          paddingRight: theme.spacing(3),
          borderTopRightRadius: theme.shape.borderRadius,
          borderBottomRightRadius: theme.shape.borderRadius,
        },
      }),
      stickyHeader: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 100%)`,
      }),
      body: ({ theme }) => ({
        "&:first-of-type": {
          paddingLeft: theme.spacing(3),
        },
        "&:last-of-type": {
          paddingRight: theme.spacing(3),
        },
      }),
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderTop: `solid 1px ${theme.palette.divider}`,
      }),
      toolbar: {
        height: 64,
      },
      select: ({ theme }) => ({
        "&:focus": {
          borderRadius: theme.shape.borderRadius,
        },
      }),
      selectIcon: {
        width: 20,
        height: 20,
        marginTop: 2,
      },
    },
  },
};

export default Table;
