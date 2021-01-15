import { useState, useEffect } from "react";
import moment from "moment";
import { Day, DayCell, MonthPickButton, MonthSelector, EventMarkerWrapper, TwoCalendarsContainer } from "./styles";
import _ from "lodash";
import { getDateRange, rangeLength, nextMonthDays, previousMonthDays } from "./helpers";
import { NORWEGIAN_SHORT_DAY_NAMES, DATE_FORMAT } from "./constants";
import CalendarTable from "./CalendarTable";

export interface CalendarEvent {
  date: string;
  renderComponent: (key: string) => React.ReactNode;
}

interface CalendarProps {
  events: CalendarEvent[];
  rangeChanged: (fromDate: string, toDate: string | undefined) => void;
  initSelectedDay?: string;
  disableRange?: boolean;
}

const Calendar = ({ events, rangeChanged, initSelectedDay, disableRange }: CalendarProps) => {
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(moment(initSelectedDay));
  const [hoverRange, setHoverRange] = useState<string[]>([]);
  const [isRangeFreezed, setIsRangeFreezed] = useState(false);

  const getDaysOfMonth = (month: moment.Moment) => {
    const daysOfMonth: JSX.Element[] = [];
    const today = moment();
    for (let i = 1; i <= month.daysInMonth(); i++) {
      const date = moment(month);
      date.set("date", i);
      const dateEvents = events.filter((event) => event.date === date.format(DATE_FORMAT));
      daysOfMonth.push(
        <DayCell
          onMouseOver={() =>
            isRangeFreezed || disableRange
              ? null
              : setHoverRange(getDateRange(selectedDay.format(DATE_FORMAT), date.format(DATE_FORMAT)))
          }
          isInHoverRange={_.includes(hoverRange, date.format(DATE_FORMAT))}
          isSelected={
            date.isSame(selectedDay, "day") ||
            (hoverRange[hoverRange.length - 1] !== undefined && date.isSame(hoverRange[hoverRange.length - 1], "day"))
          }
          onClick={() => handleDateClicked(date)}
          key={date.format(DATE_FORMAT)}
          isDisabled={date.isBefore(today, "day")}
        >
          <Day>{i}</Day>
          <EventMarkerWrapper>
            {dateEvents ? dateEvents.map((event, index) => event.renderComponent(`${index}`)) : null}
          </EventMarkerWrapper>
        </DayCell>
      );
    }
    return daysOfMonth;
  };

  const getRows = (month: moment.Moment) => {
    const slots: JSX.Element[] = [
      ...previousMonthDays(month, selectedDay, handleDateClicked, false, "next"),
      ...getDaysOfMonth(month),
    ];
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

  const handleDateClicked = (date: moment.Moment) => {
    if (hoverRange.length > 0 && !isRangeFreezed) {
      rangeChanged(hoverRange[0], hoverRange[hoverRange.length - 1]);
      setIsRangeFreezed(true);
    } else {
      rangeChanged(date.format(DATE_FORMAT), undefined);
      setSelectedDay(date);
      setIsRangeFreezed(false);
      setHoverRange([]);
    }
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
  }, [selectedDay]);

  return (
    <>
      <MonthSelector>
        <MonthPickButton onClick={() => onChangeMonth(-1)}>{"<"}</MonthPickButton>
        <MonthPickButton onClick={() => onChangeMonth(1)}>{">"}</MonthPickButton>
      </MonthSelector>
      <TwoCalendarsContainer>
        <CalendarTable getRows={getRows} month={selectedMonth.clone()} />
        <CalendarTable getRows={getRows} month={selectedMonth.clone().add(1, "month")} />
      </TwoCalendarsContainer>
    </>
  );
};

export const createDateRange = getDateRange;
export const getRangeLength = (fromDate: string, toDate: string) => rangeLength(fromDate, toDate);
export const CONSTANTS = { NORWEGIAN_SHORT_DAY_NAMES, DATE_FORMAT };
export default Calendar;
