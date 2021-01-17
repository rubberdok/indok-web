import React from "react";
import { Header, SelectContainer, SubHeader } from "./styles";

interface StepProps {
  header: string;
  subHeader: string;
  onClick: () => void;
  isSelected: boolean;
}

const Step: React.FC<StepProps> = ({ isSelected, header, subHeader, onClick }) => (
  <SelectContainer onClick={onClick} isSelected={isSelected}>
    <Header>{header}</Header>
    <SubHeader>{subHeader}</SubHeader>
  </SelectContainer>
);

export default Step;
