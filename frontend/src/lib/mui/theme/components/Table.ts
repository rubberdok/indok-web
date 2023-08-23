import { ThemeOptions } from "@mui/material";

export const Table: ThemeOptions["components"] = {
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-selected": {
          backgroundColor: theme.vars.palette.action.selected,
          "&:hover": {
            backgroundColor: theme.vars.palette.action.hover,
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
        color: theme.vars.palette.text.secondary,
        backgroundColor: theme.vars.palette.background.paper,
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
        backgroundColor: theme.vars.palette.background.paper,
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
        borderTop: `solid 1px ${theme.vars.palette.divider}`,
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
