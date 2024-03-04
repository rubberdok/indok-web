import { Metadata } from "next";
import { EventsPage } from "./_components/EventsPage";

export const metadata: Metadata = {
  title: "Arrangementer",
};

export default function Page() {
  return <EventsPage />;
}
