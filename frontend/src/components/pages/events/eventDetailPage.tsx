import { useQuery } from "@apollo/client";
import { GET_EVENT } from "../../../graphql/events/queries";

interface Props {
  eventId: number;
}

function parseDate(date: string) {
  return date != null ? date.replace("T", " ").split("+")[0] : "null";
}

function getName(obj: any) {
  return obj != null ? obj.name : "null";
}

const EventDetailPage: React.FC<Props> = ({ eventId }) => {
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

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
      </div>
    );
  else return null;
};

export default EventDetailPage;
