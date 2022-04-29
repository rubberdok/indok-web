import { Box, Grid, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
interface Props {
  isDisabled?: boolean;
  isFromDate?: boolean;
  isToDate?: boolean;
  isHidden?: boolean;
  value?: number;
  onClick?: () => void;
  isInRange?: boolean;
  isInvalidRange?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    aspectRatio: "1",
    color: (props: Props) => {
      if (props.isDisabled) {
        return "#cecece";
      } else if (props.isFromDate || props.isToDate || props.isInRange) {
        return "white";
      } else {
        return "black";
      }
    },
    backgroundColor: (props: Props) => {
      if (props.isHidden) {
        return "transparent";
      }
      if (props.isFromDate || props.isToDate) {
        if (props.isInvalidRange) {
          return theme.palette.error.dark;
        }
        return theme.palette.primary.main;
      }
      if (props.isInRange) {
        if (props.isInvalidRange) {
          return theme.palette.error.light;
        }
        return theme.palette.primary.light;
      }
      return theme.palette.background.paper;
    },
    cursor: (props: Props) => (props.isDisabled || props.isHidden ? "default" : "pointer"),
  },
}));

const CalendarDay: React.VFC<Props> = (props) => {
  const classes = useStyles(props);
  const { onClick, value, isHidden } = props;
  return (
    <Grid item xs component="td" onClick={onClick}>
      <Box className={classes.root}>
        <Grid container justifyContent="center" alignItems="center" style={{ height: "100%" }}>
          <Grid item>
            <Typography variant="subtitle2">{!isHidden ? value : ""}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default CalendarDay;
