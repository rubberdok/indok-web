import dayjs from "dayjs";
import nb from "dayjs/locale/nb";

dayjs.locale(nb);

export const calendarFile = (
  title: string,
  start: string,
  end: string | undefined,
  location: string | undefined,
  description: string | undefined,
  durationHours = 2,
  durationMinutes = 0
) => {
  const place = location || "";
  const startTime = dayjs(start).format("YYYYMMDDTHHmmss");
  const endTime = end
    ? dayjs(end).format("YYYYMMDDTHHmmss")
    : dayjs(start).add(durationHours, "h").add(durationMinutes, "m").format("YYYYMMDDTHHmmss");
  const file = window.URL.createObjectURL(
    new File(
      [
        `BEGIN:VCALENDAR\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nPRODID:-//${title}//NO\nVERSION:2.0\nBEGIN:VEVENT\nUID:\nDTSTART;VALUE=DATE:${startTime}\nDTEND;VALUE=DATE:${endTime}\nSUMMARY:${title}\nLOCATION:${place}\nDESCRIPTION:${description}\nURL:${window.location.href}\nEND:VEVENT\nEND:VCALENDAR`,
      ],
      `${title}.ics`,
      {
        type: "text/calendar",
      }
    )
  );
  return file;
};
