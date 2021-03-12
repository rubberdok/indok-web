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
  onClick: () => void;
  styleClassName: any;
}

const CountdownButton: React.FC<Props> = ({
  countDownDate,
  isSignedUp,
  isOnWaitingList,
  isFull,
  loading,
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

  const currentTimePart = Object.keys(timeLeft).find((interval) => timeLeft[interval] !== 0);

  const translate = (timeWord: string, time: number) => {
    if (timeWord === "days") return time > 1 ? "dager" : "dag";
    if (timeWord === "hours") return time > 1 ? "timer" : "time";
    if (timeWord === "minutes") return time > 1 ? "minutter" : "minutt";
    if (timeWord === "seconds") return time > 1 ? "sekunder" : "sekund";
  };

  return (
    <div className={classes.wrapper}>
      <Button
        className={styleClassName}
        variant="contained"
        color={isSignedUp || isOnWaitingList ? "inherit" : "primary"}
        onClick={onClick}
        disabled={currentTimePart !== undefined}
      >
        {currentTimePart
          ? `Åpner om ${timeLeft[currentTimePart]} ${translate(currentTimePart, timeLeft[currentTimePart])}`
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
