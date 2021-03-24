import React, { useEffect, useState } from "react";
import { Button, CircularProgress, createStyles, makeStyles } from "@material-ui/core";

const calculateTimeLeft = (countdownTime: string): Record<string, number> => {
  const difference = +new Date(countdownTime) - +new Date();

  if (difference > 0)
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

  return {};
};

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      position: "relative",
      float: "right",
    },
    buttonLoading: {
      color: "background",
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

interface Props {
  countDownDate: string;
  isSignedUp: boolean;
  isOnWaitingList: boolean;
  isFull: boolean;
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  styleClassName: any;
}

const CountdownButton: React.FC<Props> = ({
  countDownDate,
  isSignedUp,
  isOnWaitingList,
  isFull,
  loading,
  disabled,
  onClick,
  styleClassName,
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(countDownDate));
  const classes = useStyles();

  useEffect(() => {
    const id = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(countDownDate));
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  });

  const currentTimeParts = Object.keys(timeLeft).filter((interval) => timeLeft[interval] !== 0);

  const translate = (timeWord: string, time: number) => {
    if (timeWord === "days") return time > 1 ? "dager" : "dag";
    if (timeWord === "hours") return time > 1 ? "timer" : "time";
    if (timeWord === "minutes") return time > 1 ? "minutter" : "minutt";
    if (timeWord === "seconds") return time > 1 ? "sekunder" : "sekund";
  };

  const getCurrentTimeLeft = (timeparts: string[]) => {
    /**
     * timeparts is a list containing the elements of time that are not 0
     * ex. 3 days, 14 minutes and 3 seconds yields: ["days", "minutes", "seconds"]
     * The actual time left is stored in the Record<string, number> called timeLeft
     *
     * Shows remaining time until the event opens on the following formats depending on how much time is left:
     * XX days and YY hours
     * XX hours and YY minutes
     * XX minutes  (minutes left >= 10)
     * XX minutes and YY seconds (minutes left < 10)
     * */

    if (timeparts.length === 1) {
      return `Åpner om ${timeLeft[timeparts[0]]} ${translate(timeparts[0], timeLeft[timeparts[0]])}`;
    }
    if (timeparts[0] === "minutes") {
      if (timeLeft[timeparts[0]] < 10) {
        return `Åpner om ${timeLeft[timeparts[0]]} ${translate(timeparts[0], timeLeft[timeparts[0]])} og ${
          timeLeft[timeparts[1]]
        } ${translate(timeparts[1], timeLeft[timeparts[1]])}`;
      }
      return `Åpner om ${timeLeft[timeparts[0]]} ${translate(timeparts[0], timeLeft[timeparts[0]])}`;
    }
    return `Åpner om ${timeLeft[timeparts[0]]} ${translate(timeparts[0], timeLeft[timeparts[0]])} og ${
      timeLeft[timeparts[1]]
    } ${translate(timeparts[1], timeLeft[timeparts[1]])}`;
  };

  return (
    <div className={classes.wrapper}>
      <Button
        className={styleClassName}
        variant="contained"
        color={isSignedUp || isOnWaitingList ? "inherit" : "primary"}
        onClick={onClick}
        disabled={currentTimeParts.length !== 0 || disabled}
      >
        {currentTimeParts.length !== 0
          ? getCurrentTimeLeft(currentTimeParts)
          : isSignedUp
          ? "Meld av"
          : isOnWaitingList
          ? "Meld av venteliste"
          : isFull
          ? "Meld på venteliste"
          : "Meld på"}
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonLoading} />}
    </div>
  );
};

export default CountdownButton;
