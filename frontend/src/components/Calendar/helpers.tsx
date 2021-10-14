import { DATE_FORMAT } from "./constants";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/nb";

dayjs.locale("nb");
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

export const getDateRange = (start: string, end: string): string[] => {
  let startDate = dayjs(start);
  const endDate = dayjs(end);
  const output = [];
  while (startDate.isSameOrBefore(endDate, "date")) {
    output.push(startDate.format(DATE_FORMAT));
    startDate = startDate.add(1, "day");
  }
  return output;
};
export const rangeLength = (startDay: string, endDay: string): number => {
  return dayjs(endDay).diff(dayjs(startDay), "days") + 1;
};
