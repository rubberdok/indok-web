import moment from "moment";

export const getDateRange = (start: moment.Moment, end: moment.Moment, format = "YYYY-MM-DD"): string[] => {
    const currentDate = start.clone();
    const output = [];
    while (currentDate.isBefore(end)) {
        output.push(currentDate.format(format));
        currentDate.add(1, "day");
    }
    return output;
};
