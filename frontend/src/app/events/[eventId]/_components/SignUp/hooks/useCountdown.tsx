import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { graphql } from "@/gql/pages";
import dayjs from "@/lib/date";

/**
 * Creates a countdown based on the server time until the given `date`.
 * The countdown is updated approximately every 500 milliseconds, and should be resistant to drift.
 * @param date The date that is counted down to
 * @returns The time left until the event starts, in milliseconds
 * @returns A formatted countdown string, for more details, see [relative time](https://day.js.org/docs/en/customization/relative-time)
 */
export function useCountdown(date?: string) {
  /**
   * Difference between the client time and the server time at the time of the last server time query.
   */
  const [difference, setDifference] = useState<number>(0);

  useQuery(
    graphql(`
      query UseCountdownServerTime {
        serverTime {
          serverTime
        }
      }
    `),
    {
      onCompleted: (data) => {
        /**
         * Store the difference between the server time and the client time
         * to be able to calculate the correct time left.
         * This is necessary because the server and client time is not always
         * the same, and the server time is the correct one.
         * The difference is stored in milliseconds.
         */
        const serverTime = dayjs(data.serverTime.serverTime);
        const currentTime = dayjs();
        const difference = currentTime.diff(serverTime);
        setDifference(difference);
      },
      /**
       * Always fetch the server time from the server, completely ignoring the cache
       * as a cached server time will be outdated.
       */
      fetchPolicy: "network-only",
    }
  );

  /**
   * The time on the client at the time of the previous render.
   */
  const [currentClientTime, setCurrentClientTime] = useState(dayjs());
  /**
   * Adjust the current client time by subtracting the difference between the client time and the server time.
   * This is necessary because the server and client time is not always
   * the same, and the server time is the correct one.
   *
   * We make an assumption here that the two clocks will advance at the same pace, i.e. that when one second has passed
   * on the server, the same has happened on the client. This is not necessarily true, but it is a reasonable assumption.
   */
  const adjustedClientTime = currentClientTime.subtract(difference, "ms");
  /**
   * Time left until the event starts, in milliseconds
   */
  const timeLeft = dayjs(date).diff(adjustedClientTime);
  /**
   * A formatted countdown string, for more details, see [relative time](https://day.js.org/docs/en/customization/relative-time)
   */
  const countdownText = dayjs(date).from(adjustedClientTime);

  useEffect(() => {
    /**
     * Update the current client time every 500 milliseconds to be able to
     * calculate the correct time left.
     *
     * Note: we have no guarantees that this function will be re-run every 500 milliseconds,
     * and as such, we must update the current time rather than e.g. subtracting a second from the previous time.
     * Otherwise, the countdown will drift over time.
     * See [Countdown timer drifts significantly before event signup opens (#427)](https://github.com/rubberdok/indok-web/issues/427)
     * for more details on this.
     */
    const id = setTimeout(() => {
      setCurrentClientTime(dayjs());
    }, 500);
    return () => {
      clearTimeout(id);
    };
  });

  return { timeLeft, countdownText };
}
