import { Theme } from "@mui/material/styles";

const Typography: any = (theme: Theme) => {
  return {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body3: "p",
        },
      },

      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
  };
};

export default Typography;
