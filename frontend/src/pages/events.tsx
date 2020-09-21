import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const EventInfo: NextPage = () => {
    const QUERY_EVENT = gql`
        query {
            event(id: 1) {
                id
                title
            }
        }
    `;

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

        return data.allEvents.map((event) => (
            <div key={event.id}>
                <p>
                    {event.id}: {event.title} - {event.starttime.slice(0, 19).replace("T", " ")} - {event.description}
                </p>
            </div>
        ));
    };

    const CreateEvent = () => {
        let title: HTMLInputElement;
        let description: HTMLInputElement;
        let startTime: HTMLInputElement;

        const [createEvent] = useMutation(CREATE_EVENT, {
            update(cache, { data: { createEvent } }) {
                cache.modify({
                    fields: {
                        event(existingEvents = []) {
                            const newEventRef = cache.writeFragment({
                                data: createEvent,
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

export default EventInfo;
