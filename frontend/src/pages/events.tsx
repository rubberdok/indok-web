import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import AllEvents from "../components/pages/events/allEvents";
import CreateEvent from "../components/pages/events/createEvent";

const EventPage: NextPage = () => {
    return (
        <div>
            <Link href="/"> Go Home </Link>
            <CreateEvent />
            <AllEvents />
        </div>
    );
};

export default EventPage;
