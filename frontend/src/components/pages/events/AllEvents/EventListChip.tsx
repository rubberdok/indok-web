import { useQuery } from "@apollo/client";
import { GET_SERVER_TIME } from "@graphql/utils/time/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Chip } from "@material-ui/core";
import dayjs from "dayjs";
import React from "react";

type Props = {
  event: Event;
  user?: User;
};

const EventListChip: React.FC<Props> = ({ event, user }) => {
  const { data: timeData } = useQuery(GET_SERVER_TIME);

  if (!user || !event.attendable || !event.allowedGradeYears.includes(user.gradeYear)) return null;

  if (event.isFull && event.userAttendance?.isOnWaitingList) return <Chip label="På venteliste" />;

  if (event.isFull && !event.userAttendance?.isSignedUp)
    return <Chip color="primary" label="Venteliste tilgjengelig" />;

  if (event.userAttendance?.isSignedUp) return <Chip color="primary" label="Påmeldt" />;

  if (timeData && dayjs(event.attendable.signupOpenDate).diff(dayjs(timeData.currentTime)) > 0)
    return <Chip label="Påmelding åpner snart" />;

  return <Chip label="Påmelding tilgjengelig" />;
};

export default EventListChip;
