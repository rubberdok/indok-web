import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import CreateEvent from "../../components/pages/events/createEvent";

const CreateEventsPage: NextPage = () => {
    return (
        <div>
            <CreateEvent />
            <Link href="/events"> Back to events </Link>
        </div>
    );
};

export default CreateEventsPage;
