import styled, { css } from "styled-components";
import theme from "@styles/theme";

export const CalendarTableContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const TwoCalendarsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

export const WeekDay = styled.th`
  color: ${theme.colors.primaryDark};
  text-transform: uppercase;
  font-size: 12px;
  width: 48px;
  margin: 0 5px;
  height: 39px;
`;

export const BigTable = styled.table`
  width: 100%;
`;

export const EventMarkerWrapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const EventMarker = styled.div`
  height: 4px;
  width: 4px;
  margin: 0px 1px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
`;

export const Day = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
  margin: 15%;
`;
export const MonthSelector = styled.div`
  display: flex;
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
`;
export const Month = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 14px;
`;
export const Year = styled.span`
  font-weight: 400;
  font-size: 14px;
  padding-left: 5px;
`;
export const MonthPickButton = styled.button`
  margin: 0 5px;
  border-radius: 6px;
  border: 1px solid ${theme.colors.primaryDark};
  padding: 0;
  color: ${theme.colors.primaryDark};
  background-color: white;
  padding: 6px;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: none;
  }
`;

interface DayCellProps {
  isDisabled?: boolean;
  isSelected?: boolean;
  isInHoverRange?: boolean;
  isHidden?: boolean;
}

export const SelectedDayStyles = css`
  background-color: ${theme.colors.primary};
  color: white;
  border-radius: 4px;
`;

export const DayCell = styled.td<DayCellProps>`
    position: relative;
    height: 60px;
    text-align: center;
    color: ${(props) => (props.isDisabled ? "#cecece" : "black")};

    > ${Day} {
        ${(props) => props.isSelected && SelectedDayStyles};
        ${(props) => props.isInHoverRange && !props.isSelected && `background-color: ${theme.colors.primaryLight}`};
    }

    ${EventMarker} {
        ${(props) => props.isSelected && "background-color: white"};
    }

    &:hover {
        ${(props) => (!props.isHidden && !props.isDisabled ? `cursor: pointer;` : `cursor: default;`)}
        > ${Day} {
            ${(props) =>
              !props.isSelected &&
              !props.isHidden &&
              !props.isDisabled &&
              `background-color: ${theme.colors.primaryLight}`};
        }
    }
`;
