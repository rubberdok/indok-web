import styled, { css } from "styled-components";

export const TwoCalendarsContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
`;

export const WeekDay = styled.th`
    color: #064b4b;
    text-transform: uppercase;
    font-size: 12px;
    width: 48px;
    margin: 0 5px;
    height: 39px;
`;

export const BigTable = styled.table`
    width: 500px;
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
    background-color: #6a9997;
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
export const Month = styled.p`
    font-weight: 700;
    font-size: 14px;
    margin: 0 0 0 8px;
`;
export const Year = styled.span`
    font-weight: 400;
    font-size: 14px;
    padding-left: 5px;
`;
export const MonthButtons = styled.div``;
export const MonthPickButton = styled.button`
    margin: 0 5px;
    border-radius: 6px;
    border: 1px solid #e2e2ea;
    padding: 0;
    color: #92929d;
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
    outOfRange?: boolean;
    isSelected?: boolean;
    isInRange?: boolean;
}

export const SelectedDayStyles = css`
    background-color: #f4b961;
    color: white;
    border-radius: 4px;
`;

export const DayCell = styled.td<DayCellProps>`
    position: relative;
    height: 60px;
    text-align: center;
    color: ${(props) => (props.outOfRange ? "#cecece" : "black")};

    > ${Day} {
        ${(props) => props.isSelected && SelectedDayStyles};
        ${(props) => props.isInRange && !props.isSelected && "background-color: #064B4B"};
    }

    ${EventMarker} {
        ${(props) => props.isSelected && "background-color: white"};
    }

    &:hover {
        cursor: pointer;

        > ${Day} {
            ${(props) => !props.isSelected && "background-color: #064B4B"};
        }
    }
`;
