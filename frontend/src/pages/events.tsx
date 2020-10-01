import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EVENTS } from "../graphql/events/queries";
import { CREATE_EVENT } from "../graphql/events/mutations";

interface Event {
    id: string;
    title: string;
    description: string;
    starttime: string;
}
const EventInfo: NextPage = () => {
    const AllEvents = () => {
        const { loading, error, data } = useQuery(GET_EVENTS, {
            pollInterval: 30000, // refetch the result every 30 second
        });
        // should handle loading status
        if (loading) return <p>Loading...</p>;

        if (error) return <p>Error :(</p>;

        return data.allEvents.map((event: Event) => (
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
            update: (cache, { data: { createEvent } }) => {
                cache.modify({
                    fields: {
                        allEvents: (existingEvents) => {
                            return [...existingEvents, createEvent.event];
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
                        startTime.value = "";
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
