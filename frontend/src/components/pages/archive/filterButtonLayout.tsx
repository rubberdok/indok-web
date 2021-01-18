import { Paragraph } from "@components/ui/Typography";
import React from "react";
import { ContentWrapper } from "./wrapper";

interface FilterButtonProps {
  key: string;
  active: boolean;
  title: string;
  onClick: () => void;
}

export const FilterButtonLayout: React.FC<FilterButtonProps> = ({ active, title, onClick }) => {
  return (
    <ContentWrapper
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: "20px",
        marginLeft: "30px",
        marginRight: "30px",
      }}
    >
      <button
        style={{
          background: active ? "#065A5A" : "transparent",
          borderRadius: "60%",
          padding: "8px",
          outline: "none",
        }}
        onClick={() => onClick()}
      ></button>
      <Paragraph style={{ fontSize: "14px", padding: "8px", marginBottom: "12px", marginRight: "-16px" }}>
        {title}
      </Paragraph>
    </ContentWrapper>
  );
};
