import { Button } from "@mui/material";

import withStyles from "@mui/styles/withStyles";

const WarningButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
}))(Button);

export default WarningButton;
