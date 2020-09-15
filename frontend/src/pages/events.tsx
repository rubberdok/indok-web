import { gql } from "apollo-boost";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { useQuery } from "react-apollo";

const EventInfo: NextPage = () => {
    const QUERY_EVENT = gql`
        query {
            event(id: 1) {
                id
                title
            }
        }
    `;

    const QUERY_ALL_EVENTS = gql`
        query {
            allEvents {
                id
                title
            }
        }
    `;

    const { data, loading } = useQuery(QUERY_ALL_EVENTS, {
        pollInterval: 30000, // refetch the result every 30 second
    });

    // should handle loading status
    if (loading) return <p>Loading...</p>;

    if (data.event)
        return (
            <div>
                <p>
                    {data.event.id}: {data.event.title}
                </p>
            </div>
        );

    return (
        <div>
            <Link href="/"> Go Home </Link>
            {data.allEvents.map((event) => (
                <div key={event.id}>
                    <p>
                        {event.id}: {event.title}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default EventInfo;
