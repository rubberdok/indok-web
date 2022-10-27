import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

export function initializeDayjs() {
  dayjs.extend(LocalizedFormat);
  dayjs.locale(nb);
}
