import { makeStyles, Theme } from "@material-ui/core/styles";
import Button, { ButtonProps as MuiButtonProps } from "@material-ui/core/Button";
import { Omit } from "@material-ui/types";
import { Grid, Box } from "@material-ui/core";
interface Props {
  isDisabled?: boolean;
  isSelected?: boolean;
  isHidden?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: 50,

    color: (props: Props) => (props.isDisabled ? "#cecece" : "black"),
    backgroundColor: (props: Props) => (props.isSelected ? theme.palette.secondary.main : "transparent"),
  },
}));

const DayCell = (props: Props & Omit<MuiButtonProps, keyof Props>) => {
  const { isDisabled, isSelected, isHidden, ...other } = props;
  const classes = useStyles(props);
  return (
    <Grid item xs component="td">
      {isDisabled ? <Box className={classes.root} {...other} /> : <Button className={classes.root} {...other} />}
    </Grid>
  );
};

export default DayCell;
