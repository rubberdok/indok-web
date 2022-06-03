import { Theme } from "@mui/material/styles";

const Typography = (theme: Theme): Theme["components"] => {
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
