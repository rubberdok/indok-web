import theme from "@styles/theme";
import styled from "styled-components";

export const BookingContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Dropdown = styled.div<{ small?: boolean }>`
  ${(props) => (props.small ? `width: 40%;` : ``)};
  flex-direction: column;
  background-color: white;
  margin: 15px;
  padding: 12px 16px;
  z-index: 1;
  border-radius: 30px;
  display: flex;
`;

export const FlowContainer = styled.div`
  display: flex;
  align-items: center;
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
  justify-content: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.primary};
  color: white;
  border-radius: 25px;
  width: 50px;
  height: 50px;
  margin-right: 5px;
  margin-left: 5px;
  &:hover {
    cursor: pointer;
    background-color: ${theme.colors.primaryLight};
    color: white;
  }
`;

export const DropdownButton = styled.div<{ isSelected: boolean }>`
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${theme.colors.background};
    color: black;
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TextContainer = styled.div<{ direction?: "right" | "left" | "center"; small?: boolean }>`
  text-align: ${(props) => (props.direction ? props.direction : `left`)};
  width: ${(props) => (props.small ? `20%` : `80%`)};
`;
