import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";

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

  console.log(isSignedUp, isOnWaitingList, isFull);

  return (
    <Button
      className={styleClassName}
      variant="contained"
      color={isSignedUp || isOnWaitingList ? "inherit" : "primary"}
      onClick={onClick}
      disabled={currentTimePart !== undefined}
      loading={loading}
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
  );
};

export default CountdownButton;
