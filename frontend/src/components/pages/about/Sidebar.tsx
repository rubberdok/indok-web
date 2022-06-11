import { Button } from "@material-ui/core";
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

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Box component="ul" className={classes.root}>
      <li>
        <Link href="/about" passHref>
          <Button
            component="a"
            variant="outlined"
            size="large"
            className={router.pathname == "/about" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Om oss
          </Button>
        </Link>
      </li>
      <li>
        <Link href="/about/organization" passHref>
          <Button
            component="a"
            variant="outlined"
            size="large"
            className={router.pathname == "/about/organization" ? "MuiButton-outlinedPrimary" : ""}
            fullWidth
          >
            Våre foreninger
          </Button>
        </Link>
      </li>
      <li>
        <Link href="/about/board" passHref>
          <Button
            component="a"
            variant="outlined"
            size="large"
            className={router.pathname == "/about/board" ? "MuiButton-outlinedPrimary" : ""}
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
