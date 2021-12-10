import { Typography } from "@material-ui/core";
import React from "react";

export const wrapInTypo = (para: JSX.Element[] | string, className: string) => {
  return <Typography className={className}>{para}</Typography>;
};

export const formatDescription = (desc: string, innerClass: string, outerClass: string) => {
  return desc.split("\r\n\r\n").map((p) =>
    wrapInTypo(
      p.split("\r\n").map((t) => wrapInTypo(t, innerClass)),
      outerClass
    )
  );
};
