import React from "react";
import { Paragraph } from "@components/ui/Typography";
import { ContentWrapper } from "./wrapper";

interface FilterButtonProps {
  key: string;
  active: boolean;
  title: string;
  onClick: () => void;
}

export const FilterButtonLayout = ({ active, title, onClick }: FilterButtonProps) => {
  return (
    <ContentWrapper>
      <button
        style={{
          background: active ? "#065A5A" : "transparent",
          borderRadius: "60%",
          padding: "12px",
          marginLeft: "120px",
          outline: "none",
        }}
        onClick={() => onClick()}
      ></button>
      <Paragraph style={{ fontSize: "14px", padding: "12px", marginBottom: "12px" }}>{title}</Paragraph>
    </ContentWrapper>
  );
};
