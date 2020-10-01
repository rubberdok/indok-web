import { useMutation, useQuery } from "@apollo/client";
import { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { CREATE_EVENT } from "../graphql/events/mutations";
import { GET_EVENTS } from "../graphql/events/queries";

interface Event {
    id: string;
    title: string;
    description: string;
    starttime: string;
}
const EventPage: NextPage = () => {
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
        const deafultInput = {
            title: "",
            description: "",
            starttime: "",
        };

        const [inputData, setInputData] = useState(deafultInput);

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

        const { title, description, starttime } = inputData;
        return (
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createEvent({
                            variables: inputData,
                        });
                        setInputData(deafultInput);
                    }}
                >
                    <div>
                        <input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setInputData({ ...inputData, title: e.currentTarget.value })}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setInputData({ ...inputData, description: e.currentTarget.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="datetime-local"
                            placeholder="Start time"
                            value={starttime}
                            onChange={(e) => setInputData({ ...inputData, starttime: e.currentTarget.value })}
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

export default EventPage;
