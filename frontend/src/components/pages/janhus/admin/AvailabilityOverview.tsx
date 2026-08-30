import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import { formatTime } from "@/components/pages/janhus/helpers";
import dayjs from "@/lib/date";

type Booking = {
  status: string;
  startsAt: string;
  endsAt: string;
  area: { id: string };
};

type Area = {
  id: string;
  name: string;
  conflictingAreaIds?: readonly string[] | null;
};

type Props = {
  areas: readonly Area[];
  bookings: readonly Booking[];
};

export const AvailabilityOverview: React.FC<Props> = ({ areas, bookings }) => {
  const [weekAnchor, setWeekAnchor] = useState(dayjs().format("YYYY-MM-DD"));

  const availabilityByArea = useMemo(() => {
    const weekStart = dayjs(weekAnchor).weekday(0);
    const weekDays = Array.from({ length: 7 }).map((_, index) => weekStart.add(index, "day"));

    const activeBookings = bookings.filter(
      (booking) => booking.status !== "DECLINED" && booking.status !== "CANCELLED"
    );

    return areas.map((area) => {
      const conflictingAreaIds = area.conflictingAreaIds ?? [area.id];
      const bookingsByDay = weekDays.map((day) => {
        const areaBookings = activeBookings
          .filter(
            (booking) => conflictingAreaIds.includes(booking.area.id) && dayjs(booking.startsAt).isSame(day, "day")
          )
          .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

        return {
          key: day.format("YYYY-MM-DD"),
          label: day.format("ddd DD.MM"),
          bookings: areaBookings,
        };
      });

      return { area, bookingsByDay };
    });
  }, [areas, bookings, weekAnchor]);

  const weekStartLabel = useMemo(() => dayjs(weekAnchor).weekday(0).format("DD.MM.YYYY"), [weekAnchor]);

  const shiftWeek = (days: number) => setWeekAnchor(dayjs(weekAnchor).add(days, "day").format("YYYY-MM-DD"));

  return (
    <Card variant="outlined" elevation={0}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Tilgjengelighet</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
            <TextField
              type="date"
              label="Uke (ankerdato)"
              InputLabelProps={{ shrink: true }}
              value={weekAnchor}
              onChange={(event) => setWeekAnchor(event.target.value)}
              sx={{ maxWidth: 220 }}
            />
            <Button size="small" variant="outlined" onClick={() => shiftWeek(-7)}>
              Forrige uke
            </Button>
            <Button size="small" variant="outlined" onClick={() => shiftWeek(7)}>
              Neste uke
            </Button>
            <Typography variant="body2" color="text.secondary">
              Uke starter {weekStartLabel}
            </Typography>
          </Stack>

          <Grid container spacing={1}>
            {availabilityByArea.map((areaInfo) => (
              <Grid item xs={12} md={4} key={areaInfo.area.id}>
                <Card variant="outlined" elevation={0}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {areaInfo.area.name}
                    </Typography>
                    <Stack spacing={0.5}>
                      {areaInfo.bookingsByDay.map((day) => (
                        <Box key={`${areaInfo.area.id}-${day.key}`}>
                          <Typography variant="caption" color="text.secondary">
                            {day.label}
                          </Typography>
                          {day.bookings.length ? (
                            <Typography variant="body2">
                              {day.bookings
                                .slice(0, 2)
                                .map((booking) => `${formatTime(booking.startsAt)}–${formatTime(booking.endsAt)}`)
                                .join(", ")}
                              {day.bookings.length > 2 ? ` (+${day.bookings.length - 2})` : ""}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="success.main">
                              Ledig
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
