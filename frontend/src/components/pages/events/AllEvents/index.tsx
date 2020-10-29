import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "@graphql/events/queries";
import Link from "next/link";
import { Event } from "@interfaces/events";
import React, { useState } from "react";
import FilterMenu from "./filterMenu";

export interface FilterQuery {
    organization?: string;
    category?: string;
    startTime?: string;
    endTime?: string;
}

const AllEvents: React.FC = () => {
    const [filters, setFilters] = useState({});
    const [showTableView, setShowTableView] = useState(false);
    const { loading, error, data, refetch } = useQuery(GET_EVENTS, {
        variables: filters,
    });
    // should handle loading status
    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    const onChange = (newFilters: FilterQuery) => {
        setFilters(newFilters);
        refetch(newFilters);
    };

    return (
        <div>
            <FilterMenu filters={filters} onChange={onChange} />
            <div style={{ float: "right", width: "70%" }}>
                <button onClick={() => setShowTableView(!showTableView)}>
                    {showTableView ? "Vis liste" : "Vis kalender"}
                </button>
                {showTableView ? (
                    <p>{"Kommer snart! :)"}</p>
                ) : (
                    <>
                        {data.allEvents.length === 0 ? (
                            <h4>{"Ingen arrangementer passer til valgte filtere"}</h4>
                        ) : (
                            data.allEvents.map((event: Event) => (
                                <Link href={`/events/${event.id}`} key={event.id}>
                                    <a href={`/events/${event.id}`} style={{ color: "#000" }}>
                                        <div
                                            style={{
                                                border: "solid",
                                                borderWidth: "0.1em",
                                                padding: "0.5em",
                                                marginBottom: "0.5em",
                                            }}
                                        >
                                            <p style={{ marginBottom: "0.2em" }}>{event.title}</p>
                                            <p style={{ marginTop: 0 }}>
                                                Starttid: {event.startTime.slice(0, 19).replace("T", " ")}
                                            </p>
                                        </div>
                                    </a>
                                </Link>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllEvents;
