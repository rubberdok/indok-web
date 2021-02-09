import dayjs from "dayjs";
import React from "react";
import { BigTable, CalendarTableContainer, Month, WeekDay, Year } from "./styles";
import { DAYS_IN_WEEK } from "./constants";

interface Props {
  getRows: (month: dayjs.Dayjs) => React.ReactNode[];
  month: dayjs.Dayjs;
}

const CalendarTable: React.FC<Props> = ({ getRows, month }) => (
  <CalendarTableContainer>
    <Month>
      {month.format("MMMM")}
      <Year>{month.format("YYYY")}</Year>
    </Month>
    <div>
      <BigTable>
        <thead>
          <tr>
            {DAYS_IN_WEEK.map((dow) => (
              <WeekDay key={dow}>{dow}</WeekDay>
            ))}
          </tr>
        </thead>
        <tbody>
          {getRows(month).map((row, index) => (
            <tr key={`row-${index}`}>{row}</tr>
          ))}
        </tbody>
      </BigTable>
    </div>
  </CalendarTableContainer>
);
export default CalendarTable;
