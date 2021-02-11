import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    //backgroundColor: theme.palette.background.paper,
    padding: 0,
    listStyle: "none",
    borderLeft: "1px solid rgb(0 0 0 / 13%)",
    paddingLeft: 40,
    paddingBottom: 20,

    "& h6": {
      fontSize: 22,
      lineHeight: "52px",
      margin: 0,
    },

    "& li": {
      display: "flex",
      alignItems: "center",
      marginBottom: 10,
    },

    "& a": {
      color: "black",
      lineHeight: "30px",
      fontSize: 18,
      fontWeight: 200,
    },
    "& div": {
      content: "' '",

      width: "16px",
      height: "0.6px",
      background: "black",
      marginRight: 16,
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList() {
  const classes = useStyles();

  return (
    <Box component="ul" className={classes.root}>
      <li>
        <Typography variant="h6">Om oss</Typography>
      </li>
      <li>
        <div />
        <a>Introduksjon</a>
      </li>
      <li>
        <div />
        <a>Hvem er Hovedstyret?</a>
      </li>
      <li>
        <div />
        <a>Vedtekter</a>
      </li>
      <li>
        <Typography variant="h6">Organisasjoner</Typography>
      </li>
      <li>
        <div />
        <a>Oversikt</a>
      </li>
      <li>
        <div />
        <a>Bindeleddet</a>
      </li>
      <li>
        <div />
        <a>ESTIEM</a>
      </li>
      <li>
        <div />
        <a>Hyttestyret</a>
      </li>
      <li>
        <div />
        <a>Janus</a>
      </li>
      <li>
        <div />
        <a>Janus IF</a>
      </li>
    </Box>
  );
}
