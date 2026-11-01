import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import clsx from "clsx";

type Props = {
  isDisabled?: boolean;
  isFromDate?: boolean;
  isToDate?: boolean;
  isHidden?: boolean;
  value: number | string;
  onClick?: () => void;
  isInRange?: boolean;
  /** Dots under the date, e.g. one per booking. At most three are drawn. */
  markers?: number;
};

const MAX_MARKERS = 3;

export const CalendarDay: React.VFC<Props> = ({
  onClick,
  value,
  isHidden,
  isDisabled,
  isToDate,
  isInRange,
  isFromDate,
  markers,
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
        {markers && !isHidden ? (
          <Stack
            direction="row"
            spacing={0.25}
            position="absolute"
            bottom={2}
            left="50%"
            sx={{ transform: "translateX(-50%)" }}
            aria-hidden
          >
            {Array.from({ length: Math.min(markers, MAX_MARKERS) }, (_, index) => (
              <Box key={index} width={4} height={4} borderRadius="50%" bgcolor="currentColor" />
            ))}
          </Stack>
        ) : null}
      </Box>
    </Grid>
  );
};
