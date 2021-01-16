import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import { NextPage } from "next";
import React from "react";
import AllEvents from "../../components/pages/events/AllEvents/index";

const Events: NextPage = () => {
  return (
    <Layout>
      <div>
        <h1>Arrangementer</h1>
      </div>

      <div style={{ float: "left", marginRight: "10px" }}>
        <Button back styling="primary" link="/">
          Tilbake til forsiden
        </Button>
      </div>
      <div style={{ float: "right", marginLeft: "10px" }}>
        <Button styling="primary" link="/events/create-event">
          Opprett nytt arrangement
        </Button>
      </div>

      <div style={{ marginTop: "6em" }}>
        <AllEvents />
      </div>
    </Layout>
  );
};

export default Events;

/*

import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { gql, useMutation, useQuery, DataProxy, FetchResult } from "@apollo/client";

const Events: NextPage = () => {
    const CREATE_EVENT = gql`
        mutation CreateEvent($title: String, $description: String, $starttime: DateTime) {
            createEvent(title: $title, description: $description, starttime: $starttime) {
                ok
                event {
                    id
                    title
                    description
                    starttime
                }
            }
        }
    `;

    const QUERY_ALL_EVENTS = gql`
        query {
            allEvents {
                id
                title
                description
                starttime
            }
        }
    `;
    const AllEvents = () => {
        const { loading, error, data } = useQuery(QUERY_ALL_EVENTS, {
            pollInterval: 30000, // refetch the result every 30 second
        });
        // should handle loading status
        if (loading) return <p>Loading...</p>;

        if (error) return <p>Error :(</p>;

        return (
            <div style={{ float: "right" }}>
                {data.allEvents.map((event) => (
                    <Link href={`/events/${event.id}`} key={event.id}>
                        <div style={{ border: "solid", borderWidth: "1px", padding: "5px 10px", width: "60vw" }}>
                            <p>
                                {event.id}: {event.title} - {event.starttime.slice(0, 19).replace("T", " ")} -{" "}
                                {event.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    const alternativeUpdateCache = (cache: DataProxy, fetchResult: FetchResult) => {
        const currentEvents = (cache.readQuery({ query: QUERY_ALL_EVENTS }) as any).allEvents;
        console.log(currentEvents);
        if (fetchResult.data) {
            const newEvent = fetchResult.data.createEvent.event;
            console.log(newEvent);
            cache.writeQuery({ query: QUERY_ALL_EVENTS, data: { allEvents: [...currentEvents, newEvent] } });
        }
    };

    const CreateEvent = () => {
        let title: HTMLInputElement;
        let description: HTMLInputElement;
        let startTime: HTMLInputElement;

        const [createEvent] = useMutation(CREATE_EVENT, {
            update(cache, { data: { createEvent } }) {
                cache.modify({
                    fields: {
                        allEvents(existingEvents = []) {
                            const newEventRef = cache.writeFragment({
                                data: createEvent.event,
                                fragment: gql`
                                    fragment NewEvent on Event {
                                        id
                                        title
                                        description
                                        starttime
                                    }
                                `,
                            });
                            return [...existingEvents, newEventRef];
                        },
                    },
                });
            },
        });

        return (
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createEvent({
                            variables: {
                                title: title.value,
                                description: description.value,
                                starttime: startTime.value,
                            },
                        });
                        title.value = "";
                        description.value = "";
                    }}
                >
                    <div>
                        <input
                            placeholder="Title"
                            ref={(node) => {
                                title = node;
                            }}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Description"
                            ref={(node) => {
                                description = node;
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="datetime-local"
                            placeholder="Start time"
                            ref={(node) => {
                                startTime = node;
                            }}
                        />
                    </div>
                    <button type="submit">Create Event</button>
                </form>
            </div>
        );
    };

    return (
        <div>
            <Link href="/"> Go Home </Link>
            <CreateEvent />
            <AllEvents />
        </div>
    );
};

export default Events;


*/
