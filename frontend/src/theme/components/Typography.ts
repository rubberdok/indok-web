import { ThemeOptions } from "@mui/material";

const Typography: ThemeOptions["components"] = {
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        body3: "p",
      },
    },
  },
};

export default Typography;
