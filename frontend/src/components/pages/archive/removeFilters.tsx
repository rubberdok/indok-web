import { Typography } from "@material-ui/core";
import React from "react";
import { ContentWrapper } from "./wrapper";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export const RemoveFilters = () => {
  return (
    <ContentWrapper
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
    >
      <button
        style={{
          background: "rgb(255, 0, 0, 0.2)",
          borderRadius: "20px",
          margin: "6px",
          outline: "none",
          cursor: "pointer",
          display: "inline-block",
          border: "none",
        }}
        onClick={() => removeAllFilters()}
      >
        <ContentWrapper
          style={{
            justifyContent: "center",
            marginBottom: "7px",
            marginTop: "7px",
            paddingLeft: "14px",
            paddingRight: "8px",
          }}
        >
          <Typography
            style={{
              fontSize: "14px",
              //fontWeight: "bolder",
              justifyContent: "space-evenly",
              color: "black",
            }}
          >
            {"Fjern filtrering"}
          </Typography>
          <HighlightOffIcon style={{ fontSize: "medium", marginLeft: "6px", opacity: 0.8 }} />
        </ContentWrapper>
      </button>
    </ContentWrapper>
  );
};
