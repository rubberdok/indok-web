import { makeStyles } from "@material-ui/core/styles";
import Button, { ButtonProps as MuiButtonProps } from "@material-ui/core/Button";
import { Omit } from "@material-ui/types";
interface Props {
  isDisabled?: boolean;
  isSelected?: boolean;
  isInHoverRange?: boolean;
  isHidden?: boolean;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    minHeight: "100%",
    textAlign: "center",
    color: (props: Props) => (props.isDisabled ? "#cecece" : "black"),
  },
});

const DayCell = (props: Props & Omit<MuiButtonProps, keyof Props>) => {
  const { isDisabled, isSelected, isInHoverRange, isHidden, ...other } = props;
  const classes = useStyles(props);
  return <Button className={classes.root} {...other} />;
};

export default DayCell;
