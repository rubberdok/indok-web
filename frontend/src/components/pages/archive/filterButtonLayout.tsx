import { Typography } from "@material-ui/core";
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
      }}
    >
      <button
        style={{
          background: active ? "#065A5A" : "rgb(6, 90, 90, 0.1)",
          borderRadius: "20px",
          marginRight: "20px",
          marginTop: "6px",
          marginBottom: "6px",
          outline: "none",
          cursor: "pointer",
          display: "inline-block",
          border: "none",
        }}
        onClick={() => onClick()}
      >
        <Typography
          style={{
            fontSize: "14px",
            paddingLeft: "14px",
            paddingRight: "14px",
            justifyContent: "space-evenly",
            color: active ? "#F5F0EB" : "black",
          }}
        >
          {title}
        </Typography>
      </button>
    </ContentWrapper>
  );
};
