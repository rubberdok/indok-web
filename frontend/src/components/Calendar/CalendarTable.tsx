import { Grid, Stack, Typography } from "@mui/material";
import React from "react";

import dayjs from "@/lib/date";

type Props = {
  month: dayjs.Dayjs;
  previousMonthIcon: React.ReactNode;
  nextMonthIcon: React.ReactNode;
};

export const CalendarTable: React.FC<React.PropsWithChildren<Props>> = ({
  month,
  children,
  previousMonthIcon,
  nextMonthIcon,
}) => {
  return (
    <Stack spacing={2} width={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {previousMonthIcon}
        <Typography variant="h6" textTransform="capitalize" align="center">{`${month.format("MMMM")} ${month.format(
          "YYYY"
        )}`}</Typography>
        {nextMonthIcon}
      </Stack>
      <Grid component="table" sx={{ width: 1 }}>
        <Grid container component="thead">
          <Grid item container xs component="tr">
            {["man", "tir", "ons", "tor", "fre", "lør", "søn"].map((dow: string) => (
              <Grid
                item
                xs
                component="th"
                key={dow}
                sx={{
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                {dow}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid container component="tbody" direction="column">
          {children}
        </Grid>
      </Grid>
    </Stack>
  );
};
