import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
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

    "& li": {
      display: "flex",
      alignItems: "center",
      marginBottom: 10,
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Sidebar = (props: { active: string }) => {
  const classes = useStyles();

  return (
    <Box component="ul" className={classes.root}>
      {/* <li>
        <Typography variant="h6">Om oss</Typography>
      </li> */}
      <li>
        <Link href="/about">
          <Button
            component="a"
            variant="outlined"
            className={props.active == "" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Introduksjon
          </Button>
        </Link>
      </li>
      <li>
        <Link href="/about/organisasjonskart">
          <Button
            component="a"
            variant="outlined"
            className={props.active == "organisasjonskart" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Organisasjonskart
          </Button>
        </Link>
      </li>
      <li>
        <Link href="/about/hovedstyret">
          <Button
            component="a"
            variant="outlined"
            className={props.active == "hovedstyret" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Hovedstyret
          </Button>
        </Link>
      </li>
    </Box>
  );
};

export default Sidebar;
