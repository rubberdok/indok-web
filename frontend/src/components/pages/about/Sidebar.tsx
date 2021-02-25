import { Button, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { useRouter } from "next/router";
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

const Sidebar = () => {
  const router = useRouter();
  const classes = useStyles();

  return (
    <Box component="ul" className={classes.root}>
      <li>
        <Typography variant="h6">Om oss</Typography>
      </li>
      <li>
        <Link href="/about">
          <Button
            component="a"
            variant="outlined"
            className={router.pathname == "/about" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Introduksjon
          </Button>
        </Link>
      </li>
      <li>
        <Link href="/about/historie">
          <Button
            component="a"
            variant="outlined"
            className={router.pathname == "/about/historie" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Historie
          </Button>
        </Link>
      </li>
      <li>
        <Link href="/about/hvem">
          <Button
            component="a"
            variant="outlined"
            className={router.pathname == "/about/hvem" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Hvem er Hovedstyret?
          </Button>
        </Link>
      </li>
      <li>
        <Link href="/about/vedtekter">
          <Button
            component="a"
            variant="outlined"
            className={router.pathname == "/about/vedtekter" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Vedtekter
          </Button>
        </Link>
      </li>
      <br />
      <li>
        <Typography variant="h6">Organisasjoner</Typography>
      </li>
      <li>
        <Button variant="outlined" fullWidth>
          Organisasjonstre
        </Button>
      </li>
      <li>
        <Button variant="outlined" fullWidth>
          Indøk Kultur
        </Button>
      </li>
    </Box>
  );
};

export default Sidebar;
