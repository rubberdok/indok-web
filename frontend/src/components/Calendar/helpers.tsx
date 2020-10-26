import moment from "moment";
import { DATE_FORMAT } from "./constants";
import { Day, DayCell } from "./styles";

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
export const rangeLength = (startDay: string, endDay: string): number => {
    const start = moment(startDay, "YYYY-MM-DD");
    const end = moment(endDay, "YYYY-MM-DD");
    return end.diff(start, "days") + 1;
};

export const previousMonthDays = (
    month: moment.Moment,
    selectedDay: moment.Moment,
    dateClicked: (date: moment.Moment) => void,
    key = ""
) => {
    const previousDays: JSX.Element[] = [];
    const firstOfMonth = month.clone().startOf("month");
    const mondayIndex = 0;

    // Check if Month starts with a Monday
    if (firstOfMonth.weekday() !== mondayIndex) {
        const previousMonday = firstOfMonth.clone().subtract(1, "months").endOf("month").weekday(mondayIndex);
        const dayDifference = firstOfMonth.diff(previousMonday, "days") + 1;

        for (let i = 0; i < dayDifference; i++) {
            const date = moment(firstOfMonth);
            date.subtract(dayDifference - i, "day");
            previousDays.push(
                <DayCell
                    isSelected={date.isSame(selectedDay, "day")}
                    onClick={() => dateClicked(date)}
                    outOfRange={true}
                    key={`${key}-${date.format(DATE_FORMAT)}`}
                >
                    <Day>{date.format("D")}</Day>
                </DayCell>
            );
        }
    }
    return previousDays;
};

export const nextMonthDays = (
    month: moment.Moment,
    selectedDay: moment.Moment,
    dateClicked: (date: moment.Moment) => void
) => {
    const nextDays: JSX.Element[] = [];
    const endOfMonth = month.clone().endOf("month");
    const sundayIndex = 6;

    // Check if Month ends with a sunday
    if (endOfMonth.weekday() !== sundayIndex) {
        const nextSunday = endOfMonth.clone().add(1, "months").startOf("month").weekday(sundayIndex);
        const dayDifference = nextSunday.diff(endOfMonth, "days") + 1;

        for (let i = 0; i < dayDifference; i++) {
            const date = moment(endOfMonth);
            date.add(i + 1, "day");
            nextDays.push(
                <DayCell
                    isSelected={date.isSame(selectedDay, "day")}
                    onClick={() => dateClicked(date)}
                    outOfRange={true}
                    key={`${date.format(DATE_FORMAT)}`}
                >
                    <Day>{date.format("D")}</Day>
                </DayCell>
            );
        }
    }
    return nextDays;
};
