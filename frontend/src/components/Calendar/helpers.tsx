import moment from "moment";
import { DATE_FORMAT } from "./constants";
import { Day, DayCell } from "./styles";

export const getDateRange = (start: string, end: string, format = DATE_FORMAT): string[] => {
    const currentDate = moment(start);
    const endDate = moment(end);
    const output = [];
    endDate.add(1, "day");
    while (currentDate.isBefore(endDate)) {
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
    visable = true,
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
                visable ? (
                    <DayCell
                        isSelected={date.isSame(selectedDay, "day")}
                        onClick={() => dateClicked(date)}
                        isDisabled={true}
                        key={`${key}-${date.format(DATE_FORMAT)}`}
                    >
                        <Day>{date.format("D")}</Day>
                    </DayCell>
                ) : (
                        <DayCell isHidden key={`${key}-${date.format(DATE_FORMAT)}`}>
                            <Day></Day>
                        </DayCell>
                    )
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
                    isDisabled={true}
                    key={`${date.format(DATE_FORMAT)}`}
                >
                    <Day>{date.format("D")}</Day>
                </DayCell>
            );
        }
    }
    return nextDays;
};
