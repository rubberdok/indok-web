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
        pollInterval: 30000, // refetch the result every 30 seconds
        variables: { id: eventId },
    });

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    if (data.event)
        return (
            <div>
                <h3>Event: {data.event.title}</h3>

                <p>Id: {data.event.id}</p>
                <p>Title: {data.event.title}</p>
                <p>Starttime: {parseDate(data.event.starttime)}</p>
                <p>Endtime: {parseDate(data.event.endtime)}</p>
                <p>Location: {data.event.location}</p>
                <p>Description: {data.event.description}</p>
                <p>Organization: {getName(data.event.organization)}</p>
                <p>Category: {getName(data.event.category)}</p>
                <p>Image URL: {data.event.image}</p>
                <p>Is attendable: {data.event.isAttendable}</p>
                <p>Deadline: {parseDate(data.event.deadline)}</p>
                <p>Publisher: {data.event.publisher}</p>
            </div>
        );
    else return null;
};

export default EventDetailPage;
