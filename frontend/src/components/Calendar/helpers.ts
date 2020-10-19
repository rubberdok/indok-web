import moment from "moment";
import { DATE_FORMAT } from "./constants";

export const getDateRange = (start: moment.Moment, end: moment.Moment, format = DATE_FORMAT): string[] => {
    const currentDate = start.clone();
    const output = [];
    end.add(1, "day");
    while (currentDate.isBefore(end)) {
        output.push(currentDate.format(format));
        currentDate.add(1, "day");
    }
    return output;
};
