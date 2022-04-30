import { Box, Button, Grid, Typography } from "@mui/material";

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

const CalendarDay: React.VFC<Props> = (props) => {
  const { onClick, value, isHidden } = props;
  return (
    <Grid item xs component="td" position="relative">
      <Box
        component={Button}
        disabled={props.isDisabled || isHidden}
        variant={(props.isFromDate || props.isToDate || props.isInRange) && !isHidden ? "contained" : "text"}
        bgcolor={
          !(props.isFromDate || props.isToDate || props.isInRange) || isHidden
            ? "transparent"
            : props.isFromDate || props.isToDate
            ? "primary.darker"
            : "primary.dark"
        }
        onClick={onClick}
        sx={{ width: 1, p: 0, minWidth: 0, aspectRatio: "1" }}
      >
        <Typography variant="subtitle2">{!isHidden ? value : ""}</Typography>
      </Box>
    </Grid>
  );
};

export default CalendarDay;
