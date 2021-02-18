import { makeStyles, Theme, createStyles, Grid, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.primary,
    },
    container: {
      padding: "10px",
      display: "inline",
    },
  })
);

interface HeaderCompositionProps {
  headerText: string;
  arrowOnClick?: () => void;
  href?: string;
}

const HeaderComposition: React.FC<HeaderCompositionProps> = (props) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            {props.href ? (
              <Link href={props.href}>
                <ArrowBackIcon fontSize={"large"} />
              </Link>
            ) : (
              <ArrowBackIcon fontSize={"large"} onClick={props?.arrowOnClick} />
            )}
          </Grid>
          <Grid item>
            <Typography variant="h2">{props.headerText}</Typography>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default HeaderComposition;
