import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { gql, useQuery } from "@apollo/client";

const EventInfo: NextPage = () => {
    const QUERY_EVENT = gql`
        query Event($id: ID!) {
            event(id: $id) {
                id
                title
                description
                starttime
            }
        }
    `;

    const EventDetailPage = () => {
        const router = useRouter();
        const { id } = router.query;
        const numberId = typeof id === "string" && parseInt(id);

        const { loading, error, data } = useQuery(QUERY_EVENT, {
            pollInterval: 30000, // refetch the result every 30 second
            variables: { id: numberId },
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

    return (
        <div>
            <EventDetailPage />
            <Link href="/events"> Back to events </Link>
        </div>
    );
};

export default EventInfo;
