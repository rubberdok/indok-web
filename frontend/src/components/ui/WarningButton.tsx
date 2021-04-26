import { withStyles, Button } from "@material-ui/core";

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
