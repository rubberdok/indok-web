import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    backgroundColor: "#526fa0",
  },
  cards: {
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  card: {
    width: "100%",
  },
}));

export default useStyles;
