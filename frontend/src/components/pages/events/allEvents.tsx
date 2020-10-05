import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "@graphql/events/queries";
import Link from "next/link";
import { Event } from "@interfaces/events";

const AllEvents = () => {
    const { loading, error, data } = useQuery(GET_EVENTS, {
        pollInterval: 30000, // refetch the result every 30 second
    });
    // should handle loading status
    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    return (
        <div style={{ float: "right", width: "70%" }}>
            {data.allEvents.map((event: Event) => (
                <Link href={`/events/${event.id}`} key={event.id}>
                    <div
                        style={{
                            border: "solid",
                            borderWidth: "0.1em",
                            padding: "0.5em",
                            marginBottom: "0.5em",
                        }}
                    >
                        <p>
                            {event.title} - Time: {event.starttime.slice(0, 19).replace("T", " ")}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default AllEvents;
