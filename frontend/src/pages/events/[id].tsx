import Navbar from "@components/navbar/Navbar";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import EventDetailPage from "../../components/pages/events/eventDetailPage";

const EventInfo: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const numberId = typeof id === "string" && parseInt(id);

    return (
        <div>
            <Navbar />
            {numberId && <EventDetailPage eventId={numberId} />}
            <Link href="/events"> Back to events </Link>
        </div>
    );
};

export default EventInfo;
