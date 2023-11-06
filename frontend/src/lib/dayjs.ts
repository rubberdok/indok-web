import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import weekday from "dayjs/plugin/weekday";

export function initializeDayjs() {
  dayjs.extend(LocalizedFormat);
  dayjs.extend(weekday);
  dayjs.extend(isSameOrBefore);
  dayjs.extend(isBetween);
  dayjs.extend(isSameOrAfter);
  dayjs.locale(nb);
}
