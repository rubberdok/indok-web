import { useMutation, useQuery } from "@apollo/client";
import { GET_EVENT } from "../../../graphql/events/queries";
import { Button, Snackbar, Typography } from "@material-ui/core";
import { Event } from "@interfaces/events";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { User } from "@interfaces/users";
import { GET_USER } from "@graphql/auth/queries";

interface Props {
  eventId: number;
}

function parseDate(date: string) {
  return date != null ? date.replace("T", " ").split("+")[0] : "null";
}

function getName(obj: any) {
  return obj != null ? obj.name : "null";
}

function isSignedUp(event: Event, userId?: string) {
  if (!userId) return false;
  return event.signedUpUsers?.some((user) => user.id === userId);
}

const EventDetailPage: React.FC<Props> = ({ eventId }) => {
  const [eventSignUp, { loading: signUpLoading, data: signUpData }] = useMutation<{
    eventSignUp: { event: Event; isFull: boolean };
  }>(EVENT_SIGN_UP);

  const [eventSignOff, { loading: signOffLoading }] = useMutation<{
    eventSignOff: { event: Event; isFull: boolean };
  }>(EVENT_SIGN_OFF);

  const { data: userData } = useQuery<{ user: User }>(GET_USER);

  const { loading, error, data, refetch } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

  const handleClick = () => {
    if (!userData?.user.id) return;
    if (isSignedUp(data.event, userData?.user.id)) {
      eventSignOff({ variables: { eventId: eventId.toString(), userId: userData?.user.id } }).then(() =>
        refetch({ id: eventId })
      );
      return;
    }
    eventSignUp({ variables: { eventId: eventId.toString(), userId: userData?.user.id } }).then(() =>
      refetch({ id: eventId })
    );
  };

  if (data.event)
    return (
      <div>
        <h2 style={{ marginTop: -10, marginBottom: 10, textAlign: "center" }}>Event details</h2>
        <div style={{ marginBottom: 15 }}>
          <h4 style={{ margin: 0 }}>Påkrevde felt</h4>
          Id: {data.event.id}
          <br />
          Tittel: {data.event.title}
          <br />
          Starttid: {parseDate(data.event.startTime)}
          <br />
          Publisert av: {`${data.event.publisher.firstName} ${data.event.publisher.lastName}`}
          <br />
          Krever påmelding: {data.event.isAttendable ? "Ja" : "Nei"}
          <br />
          Beskrivelse: {data.event.description}
          <br />
        </div>

        <div>
          <h4 style={{ margin: 0 }}>Frivillige felt</h4>
          Sluttid: {parseDate(data.event.endTime)}
          <br />
          Lokasjon: {data.event.location}
          <br />
          Organisasjon: {getName(data.event.organization)}
          <br />
          Kategori: {getName(data.event.category)}
          <br />
          Bilde URL: {data.event.image}
          <br />
          Deadline for påmelding: {parseDate(data.event.deadline)}
          <br />
        </div>
        {data.event.isAttendable && userData?.user ? (
          data.event.signedUpUsers.length === data.event.availableSlots ? (
            <Typography variant="body1" color="primary">
              Arrangementet er fullt
            </Typography>
          ) : (
            <>
              <Button variant="contained" loading={signOffLoading || signUpLoading} onClick={handleClick}>
                <Typography variant="body1">
                  {isSignedUp(data.event, userData?.user.id) ? "Meld av" : "Meld på"}
                </Typography>
              </Button>
              <Snackbar
                severity="error"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={signUpData?.eventSignUp.isFull}
                autoHideDuration={5000}
                message="Arrangementet er fullt"
              />
            </>
          )
        ) : null}
      </div>
    );
  else return null;
};

export default EventDetailPage;
