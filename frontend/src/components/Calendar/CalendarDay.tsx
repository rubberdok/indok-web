import { Box, Button, Grid, Typography } from "@mui/material";

type Props = {
  isDisabled?: boolean;
  isFromDate?: boolean;
  isToDate?: boolean;
  isHidden?: boolean;
  value?: number;
  onClick?: () => void;
  isInRange?: boolean;
  isInvalidRange?: boolean;
};

const bgcolor = (
  isFromDate: boolean | undefined,
  isToDate: boolean | undefined,
  isInRange: boolean | undefined,
  isHidden: boolean | undefined
) => {
  if (isHidden) {
    return "transparent";
  }
  if (isFromDate || isToDate) {
    return "primary.darker";
  }
  if (isInRange) {
    return "primary.dark";
  }
  return "transparent";
};

const CalendarDay: React.VFC<Props> = ({ onClick, value, isHidden, isDisabled, isToDate, isInRange, isFromDate }) => {
  return (
    <Grid item xs component="td" position="relative">
      <Box
        component={Button}
        disabled={isDisabled || isHidden}
        variant={(isFromDate || isToDate || isInRange) && !isHidden ? "contained" : "text"}
        bgcolor={bgcolor(isFromDate, isToDate, isInRange, isHidden)}
        onClick={onClick}
        sx={{ width: 1, p: 0, minWidth: 0, aspectRatio: "1" }}
      >
        <Typography variant="subtitle2">{!isHidden ? value : ""}</Typography>
      </Box>
    </Grid>
  );
};

export default CalendarDay;
