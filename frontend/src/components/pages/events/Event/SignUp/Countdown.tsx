import { Typography } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { useCountdown } from "./hooks/useCountdown";

dayjs.extend(duration);

type CountdownStatusTextProps = {
  signupOpenDate: string;
  deadline: string;
  countdown: ReturnType<typeof useCountdown>;
};

export const CountdownStatusText: React.FC<CountdownStatusTextProps> = ({ signupOpenDate, countdown, deadline }) => {
  const { timeLeft, countdownText } = countdown;

  if (dayjs.duration(timeLeft).asDays() > 1) {
    return <Typography variant="overline">Påmelding åpner {dayjs(signupOpenDate).format("LLL")}</Typography>;
  } else if (timeLeft > 0) {
    return (
      /**
       * The countdown text is susceptible to hydration errors as the content genereted on the server
       * will probably differ in time, especially when we're counting seconds, compared to the content
       * generated on the client. The [React docs](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)
       * recommends using `suppressHydrationWarning` to suppress these errors where they are unavoidable, with
       * timestamps being one such example.
       */
      <Typography variant="overline" suppressHydrationWarning>
        Påmelding åpner {countdownText}, {dayjs(signupOpenDate).format("[kl.] HH:mm")}
      </Typography>
    );
  } else if (timeLeft < 0) {
    return <Typography variant="overline">Påmelding stenger {dayjs(deadline).format("LLL")}</Typography>;
  } else {
    return <Typography variant="overline">Påmeldingen er stengt</Typography>;
  }
};
