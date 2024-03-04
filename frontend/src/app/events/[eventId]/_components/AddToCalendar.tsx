import { Button } from "@mui/material";
import { track } from "@vercel/analytics";
import { uniqueId } from "lodash";
import { useEffect, useState } from "react";

import dayjs from "@/lib/date";

function createCalendarFile(
  title: string,
  start: string,
  end: string | null | undefined,
  location: string | null | undefined,
  durationHours = 2,
  durationMinutes = 0
): string {
  const place = location ?? "";
  const startTime = dayjs(start).format("YYYYMMDDTHHmmss");
  const endTime = end
    ? dayjs(end).format("YYYYMMDDTHHmmss")
    : dayjs(start).add(durationHours, "h").add(durationMinutes, "m").format("YYYYMMDDTHHmmss");

  const id = uniqueId();
  const attributes = [
    "BEGIN:VCALENDAR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `PRODID:-//${title}//NO`,
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${id}`,
    `DTSTART;VALUE=DATE:${startTime}`,
    `DTEND;VALUE=DATE:${endTime}`,
    `SUMMARY:${title}`,
    `LOCATION:${place}`,
    `URL:${window.location.href}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  const file = window.URL.createObjectURL(
    new File([attributes], `${title}.ics`, {
      type: "text/calendar",
    })
  );
  return file;
}

type Props = {
  title: string;
  start: string;
  end: string | null | undefined;
  location: string | null | undefined;
};
export const AddToCalendar: React.FC<Props> = ({ title, start, end, location }) => {
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    setFileUrl(createCalendarFile(title, start, end, location));
    return () => {
      window.URL.revokeObjectURL(fileUrl);
    };
  }, []);

  return (
    <Button
      variant="outlined"
      color="secondary"
      fullWidth
      href={fileUrl}
      download
      onClick={() => track("add to calendar")}
    >
      Legg til i kalender
    </Button>
  );
};
