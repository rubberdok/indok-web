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
            update: (cache, { data: { createEvent } }) => {
                cache.modify({
                    fields: {
                        allEvents: (existingEvents = []) => {
                            return [...existingEvents, createEvent.data];
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
            <CreateEvent />
            <Link href="/events"> Back to events </Link>
        </div>
    );
};

export default Events;
