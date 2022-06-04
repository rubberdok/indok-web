import { ComponentOverride } from "./types";

const Typography: ComponentOverride = (theme) => {
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
