import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "@graphql/events/queries";
import { Event } from "@interfaces/events";

const AllEvents = () => {
  const { loading, error, data } = useQuery<{ allEvents: Event[] }>(GET_EVENTS);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <p>Error : {error.message} </p>;
  }

  return (
    <>
      {data &&
        data.allEvents.map((event) => (
          <div key={event.id}>
            <p>
              {event.id}: {event.title} - {event.starttime.slice(0, 19).replace("T", " ")} - {event.description}
            </p>
          </div>
        ))}
    </>
  );
};

export default AllEvents;
