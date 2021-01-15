import styled from "styled-components";
import theme from "@styles/theme";

export const BookingContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Dropdown = styled.div`
  flex-direction: column;
  background-color: white;
  margin: 15px;
  padding: 12px 16px;
  z-index: 1;
  border-radius: 30px;
`;

export const FlowContainer = styled.div`
  display: flex;
  width: 800px;
  height: 60px;
  background-color: white;
  margin-top: 20px;
  border-radius: 30px;
`;

export const SelectContainer = styled.div<{ isSelected: boolean }>`
  ${(props) => (props.isSelected ? `background-color: ${theme.colors.primary};` : ``)};
  ${(props) => (props.isSelected ? `color: white;` : ``)};
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: 100%;
  &:hover {
    cursor: pointer;
    background-color: ${theme.colors.primary};
    color: white;
  }
  border-radius: 30px;
  text-align: center;
  padding-top: 15px;
`;

export const Header = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 14px;
`;
export const SubHeader = styled.div`
  font-weight: 400;
  font-size: 10px;
  padding-left: 5px;
`;

export const BookButton = styled.div`
  background-color: ${theme.colors.primary};
  color: white;
  border-radius: 25px;
  width: 70%;
`;
