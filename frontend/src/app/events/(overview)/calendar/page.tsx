import { Stack } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arrangementskalender",
};

export default function Page() {
  return (
    <Stack direction="row" justifyContent="center">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=sp3rre4hhjfofj8124jp5k093o%40group.calendar.google.com&ctz=Europe%2FOslo"
        style={{ border: 0 }}
        width="800"
        height="600"
        frameBorder="0"
        scrolling="no"
        title="indok-kalenderen"
      />
    </Stack>
  );
}
