import Box from "@material-ui/core/Box";
import React from "react";

interface WrapperProps {
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = (props) => {
  return (
    <Box
      style={props.style}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-around"
      alignContent="stretch"
    >
      {props.children}
    </Box>
  );
};

export const ContentWrapper: React.FC<WrapperProps> = (props) => {
  return (
    <Box
      style={props.style}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="start"
      alignContent="center"
    >
      {props.children}
    </Box>
  );
};
