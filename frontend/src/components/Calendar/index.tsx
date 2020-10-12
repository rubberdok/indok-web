import { useState, useEffect } from "react";
import moment from "moment";
import {
    Day,
    DayCell,
    WeekDay,
    Month,
    MonthButtons,
    MonthPickButton,
    MonthSelector,
    Year,
    EventMarker,
    EventMarkerWrapper,
    Wrapper,
    BigTable,
} from "./styles";
import _ from "lodash";

moment.updateLocale("nb", {
    weekdaysShort: ["søn", "man", "tir", "ons", "tor", "fre", "lør"],
});

interface CalendarProps {
    onDaySelected: (selectedDay: moment.Moment) => void;
    eventDates?: moment.Moment[];
    onMonthSelected: (selectedMonth: moment.Moment) => void;
    rangeDates?: moment.Moment[];
}

const SELECT_RANGE_FEATURE = true;

const Calendar = ({ onDaySelected, eventDates, onMonthSelected }: CalendarProps) => {
    const [selectedMonth, setSelectedMonth] = useState(moment());
    const [selectedDay, setSelectedDay] = useState(moment());
    const [events, setEvents] = useState<number[]>([]);
    const [range, setRange] = useState<number[]>([]);

    const getDaysOfMonth = () => {
        const daysOfMonth: JSX.Element[] = [];
        for (let i = 1; i <= selectedMonth.daysInMonth(); i++) {
            const date = moment(selectedMonth);
            date.set("date", i);
            daysOfMonth.push(
                <DayCell
                    onMouseOver={() => {
                        if (SELECT_RANGE_FEATURE) {
                            setRange(_.range(selectedDay.date(), i));
                        }
                    }}
                    isInRange={_.includes(range, i)}
                    isSelected={date.isSame(selectedDay, "day")}
                    onClick={() => setSelectedDay(date)}
                    key={i}
                >
                    <Day>{i}</Day>
                    <EventMarkerWrapper>
                        {events.length > 0 &&
                            [...new Array(events[i - 1])].map((x, index) => {
                                return <EventMarker key={index} />;
                            })}
                    </EventMarkerWrapper>
                </DayCell>
            );
        }
        return daysOfMonth;
    };

    const getRows = () => {
        const slots: JSX.Element[] = [...previousMonthDays(), ...getDaysOfMonth(), ...nextMonthDays()];
        let cells: JSX.Element[];
        return slots.reduce(
            (prev: JSX.Element[][], curr, index) => {
                if (index % 7 === 0) {
                    // When we reach 7 days, push new Row
                    prev.push(cells);
                    // Clear Cells
                    cells = [];
                }
                // Push current cell to cells
                cells.push(curr);
                // We reached the end, push last row
                if (index === slots.length - 1) {
                    prev.push(cells);
                }
                return prev;
            },
            [[]]
        );
    };

    const previousMonthDays = () => {
        const previousDays: JSX.Element[] = [];
        const firstOfMonth = selectedMonth.startOf("month");
        const mondayIndex = 0;

        // Check if Month starts with a Monday
        if (firstOfMonth.weekday() !== mondayIndex) {
            const previousMonday = selectedMonth.clone().subtract(1, "months").endOf("month").weekday(mondayIndex);
            const dayDifference = firstOfMonth.diff(previousMonday, "days") + 1;

            for (let i = 0; i < dayDifference; i++) {
                const date = moment(firstOfMonth);
                date.subtract(dayDifference - i, "day");
                previousDays.push(
                    <DayCell
                        isSelected={date.isSame(selectedDay, "day")}
                        onClick={() => setSelectedDay(date)}
                        outOfRange={true}
                        key={i + 31}
                    >
                        <Day>{date.format("D")}</Day>
                    </DayCell>
                );
            }
        }
        return previousDays;
    };

    const nextMonthDays = () => {
        const nextDays: JSX.Element[] = [];
        const endOfMonth = selectedMonth.endOf("month");
        const sundayIndex = 6;

        // Check if Month ends with a sunday
        if (endOfMonth.weekday() !== sundayIndex) {
            const nextSunday = selectedMonth.clone().add(1, "months").startOf("month").weekday(sundayIndex);
            const dayDifference = nextSunday.diff(endOfMonth, "days") + 1;

            for (let i = 0; i < dayDifference; i++) {
                const date = moment(endOfMonth);
                date.add(i + 1, "day");
                nextDays.push(
                    <DayCell
                        isSelected={date.isSame(selectedDay, "day")}
                        onClick={() => setSelectedDay(date)}
                        outOfRange={true}
                        key={i + 31 * 2}
                    >
                        <Day>{date.format("D")}</Day>
                    </DayCell>
                );
            }
        }
        return nextDays;
    };

    const onChangeMonth = (months: number) => {
        const newSelectedMonth = moment(selectedMonth);
        newSelectedMonth.add(months, "months");
        setSelectedMonth(newSelectedMonth);
    };

    useEffect(() => {
        if (!selectedDay.isSame(selectedMonth, "month")) {
            const newMonth = moment(selectedMonth);
            newMonth.set("month", selectedDay.get("month"));
            setSelectedMonth(newMonth);
        }
        onDaySelected(selectedDay);
    }, [selectedDay]);

    useEffect(() => {
        const eventArray = [...Array(31)].map((x) => 0);
        eventDates?.forEach((x) => {
            if (moment(x).isSame(selectedMonth, "month")) {
                const index = +x.format("D") - 1;
                eventArray[index] = eventArray[index] === 3 ? 3 : eventArray[index] + 1;
            }
        });
        setEvents(eventArray);
    }, [eventDates, selectedMonth]);

    useEffect(() => {
        onMonthSelected(selectedMonth);
    }, [selectedMonth]);

    return (
        <Wrapper>
            <MonthSelector>
                <Month>
                    {selectedMonth.format("MMMM")}
                    <Year>{selectedMonth.format("YYYY")}</Year>
                </Month>
                <MonthButtons>
                    <MonthPickButton onClick={() => onChangeMonth(-1)}>previus month</MonthPickButton>
                    <MonthPickButton onClick={() => onChangeMonth(1)}>next month</MonthPickButton>
                </MonthButtons>
            </MonthSelector>
            <BigTable>
                <thead>
                    <tr>
                        {moment.weekdaysShort(true).map((dow) => (
                            <WeekDay key={dow}>{dow}</WeekDay>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {getRows().map((row, index) => (
                        <tr key={`row-${index}`}>{row}</tr>
                    ))}
                </tbody>
            </BigTable>
        </Wrapper>
    );
};

export default Calendar;
