import moment from "moment";
import React from "react";
import { NORWEGIAN_SHORT_DAY_NAMES } from "./constants";
import { BigTable, CalendarTableContainer, Month, WeekDay, Year } from "./styles";

moment.updateLocale("nb", {
  weekdaysShort: NORWEGIAN_SHORT_DAY_NAMES,
});

interface Props {
  getRows: (month: moment.Moment) => React.ReactNode[];
  month: moment.Moment;
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
            {moment.weekdaysShort(true).map((dow) => (
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
