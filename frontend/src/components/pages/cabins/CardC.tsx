import { Card, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";

interface CardProps {
  children: React.ReactNode;
}

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
    card: {
      padding: "20px",
      boxShadow: "0px 7px 17px -1px rgba(92, 92, 92, 0.62)",
      borderRadius: "15px",
      textAlign: "center",
    },
  })
);

const CardC: React.FC<CardProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>{children}</Card>
    </>
  );
};

export default CardC;
