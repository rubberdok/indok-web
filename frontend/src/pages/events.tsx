import { NextPage } from "next";
import Layout from "@components/Layout";
import AllEvents from "@components/pages/events/allEvents";
import CreateEvent from "@components/pages/events/createEvent";

const EventPage: NextPage = () => {
    return (
        <Layout>
            <CreateEvent />
            <AllEvents />
        </Layout>
    );
};

export default EventPage;
