/* eslint-disable no-restricted-imports */
/**
 * This file configures our dayjs instance and re-exports dayjs so that
 * we can share a configured dayjs instance across our application without
 * worrying about configuring dayjs in every file that uses it, or
 * running the configuration code on initial page load.
 */

import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import objectSupport from "dayjs/plugin/objectSupport";

/**
 * Working with relative time
 */
dayjs.extend(weekday);
dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Comparison plugins
 */
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

/**
 * Object support
 */
dayjs.extend(objectSupport);

/**
 * Timezone plugins
 * - Set default timezone to Europe/Oslo
 */
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Europe/Oslo");

/**
 * Update locales
 */
dayjs.extend(updateLocale);
dayjs.extend(LocalizedFormat);

dayjs.locale(nb);
dayjs.updateLocale("nb", {
  relativeTime: {
    future: "om %s",
    past: "%s siden",
    s: "%d sekund(er)",
    m: "1 minutt",
    mm: "%d minutter",
    h: "1 time",
    hh: "%d timer",
    d: "1 dag",
    dd: "%d dager",
    M: "1 måned",
    MM: "%d måneder",
    y: "1 år",
    yy: "%d år",
  },
});

export default dayjs;
