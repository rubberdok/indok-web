import { makeStyles, Theme } from "@material-ui/core/styles";
import { BoxProps } from "@material-ui/core/Box";
import { Omit } from "@material-ui/types";
import { Grid, Box } from "@material-ui/core";
interface Props {
  isDisabled?: boolean;
  isSelected?: boolean;
  isHidden?: boolean;
  clickable?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: 60,
    color: (props: Props) => (props.isDisabled ? "#cecece" : "black"),
    backgroundColor: (props: Props) =>
      props.isSelected ? theme.palette.primary.light : props.isHidden ? "transparent" : theme.palette.background.paper,
    cursor: (props: Props) => (props.clickable ? "pointer" : "defualt"),
  },
}));

const DayCell: React.FC<Props & Omit<BoxProps, keyof Props>> = (props) => {
  const { isDisabled, isHidden, clickable, ...other } = props;
  const classes = useStyles(props);
  return (
    <Grid item xs component="td">
      <Box className={classes.root} {...other} />
    </Grid>
  );
};

export default DayCell;
