import { useQuery } from "@apollo/client";
import { GET_EVENT } from "../../../graphql/events/queries";
import Link from "next/link";

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
                    <h4 style={{ margin: 0 }}>Mandatory fields</h4>
                    Id: {data.event.id}
                    <br />
                    Title: {data.event.title}
                    Starttime: {parseDate(data.event.startTime)}
                    <br />
                    Publisher: {data.event.publisher}
                    <br />
                    Is attendable: {data.event.isAttendable}
                    <br />
                    Description: {data.event.description}
                    <br />
                </div>

                <div>
                    <h4 style={{ margin: 0 }}>Optional fields</h4>
                    Endtime: {parseDate(data.event.endTime)}
                    <br />
                    Location: {data.event.location}
                    <br />
                    Organization: {getName(data.event.organization)}
                    <br />
                    Category: {getName(data.event.category)}
                    <br />
                    Image URL: {data.event.image}
                    <br />
                    Deadline: {parseDate(data.event.deadline)}
                    <br />
                </div>

                <Link href="/events"> Back to Events</Link>
            </div>
        );
    else return null;
};

export default EventDetailPage;
