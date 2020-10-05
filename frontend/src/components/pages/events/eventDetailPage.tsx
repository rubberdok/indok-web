import { useQuery } from "@apollo/client";
import { GET_EVENT } from "../../../graphql/events/queries";

interface Props {
    eventId: number;
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
                <p>Title: {data.event.title}</p>
                <div>
                    <p>Time: {data.event.starttime.slice(0, 19).replace("T", " ")}</p>
                </div>
                <p>Description: {data.event.description}</p>
            </div>
        );
    else return null;
};

export default EventDetailPage;
