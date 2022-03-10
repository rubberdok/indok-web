import { useQuery } from "@apollo/client";
import { GET_SERVER_TIME } from "@graphql/utils/time/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Chip } from "@material-ui/core";
import dayjs from "dayjs";
import React from "react";

type Props = {
  event: Event;
  user?: User | null;
};

const EventListChip: React.VFC<Props> = ({ event, user }) => {
  const { data } = useQuery(GET_SERVER_TIME, { fetchPolicy: "network-only" });

  if (!user || !event.attendable || !event.allowedGradeYears.includes(user.gradeYear)) return null;

  if (event.attendable.userAttendance?.isOnWaitingList) return <Chip label="På venteliste" />;

  if (event.attendable.isFull && !event.attendable?.userAttendance?.isAttending)
    return <Chip label="Venteliste tilgjengelig" />;

  if (event.attendable.userAttendance?.isAttending) return <Chip color="primary" label="Påmeldt" />;

  if (data && dayjs(event.attendable.signupOpenDate).isAfter(dayjs(data.currentTime)))
    return <Chip label="Påmelding åpner snart" />;

  return <Chip color="primary" label="Påmelding tilgjengelig" />;
};

export default EventListChip;
