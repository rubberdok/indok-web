import { Box, Button, Grid, Typography } from "@mui/material";
import clsx from "clsx";

type Props = {
  isDisabled?: boolean;
  isFromDate?: boolean;
  isToDate?: boolean;
  isHidden?: boolean;
  value: number | string;
  onClick?: () => void;
  isInRange?: boolean;
};

export const CalendarDay: React.VFC<Props> = ({
  onClick,
  value,
  isHidden,
  isDisabled,
  isToDate,
  isInRange,
  isFromDate,
}) => {
  const classes = clsx({
    "booking-fromDate": !isHidden && isFromDate,
    "booking-toDate": !isHidden && isToDate,
    "booking-inSelectedRange": !isHidden && isInRange,
  });

  return (
    <Grid
      item
      xs
      component="td"
      position="relative"
      paddingY={(theme) => theme.spacing(0.5)}
      sx={{ visibility: isHidden ? "hidden" : "visible" }}
    >
      <Box
        className={classes}
        size="small"
        component={Button}
        disabled={isDisabled || isHidden}
        variant={(isFromDate || isToDate || isInRange) && !isHidden ? "contained" : "text"}
        onClick={onClick}
        width={1}
        minWidth="3rem"
      >
        <Typography variant="subtitle2">{value}</Typography>
      </Box>
    </Grid>
  );
};
