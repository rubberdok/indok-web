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
  const isSingleDate = Boolean(isFromDate && isToDate);

  const classes = clsx({
    "booking-singleDate": !isHidden && isSingleDate,
    "booking-fromDate": !isHidden && isFromDate && !isSingleDate,
    "booking-toDate": !isHidden && isToDate && !isSingleDate,
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
