import { makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
interface Props {
  isDisabled?: boolean;
  isSelected?: boolean;
  isHidden?: boolean;
  value?: number;
  onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: 60,
    color: (props: Props) => (props.isDisabled ? "#cecece" : "black"),
    backgroundColor: (props: Props) =>
      props.isSelected ? theme.palette.primary.light : props.isHidden ? "transparent" : theme.palette.background.paper,
    cursor: (props: Props) => (props.isDisabled || props.isHidden ? "default" : "pointer"),
  },
}));

const DayCell: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  const { onClick, value } = props;
  return (
    <Grid item xs component="td" onClick={onClick}>
      <Grid container justify="center" alignItems="center" style={{ height: "100%" }}>
        <Grid item>
          <Box className={classes.root}>
            <Typography>{value}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DayCell;
