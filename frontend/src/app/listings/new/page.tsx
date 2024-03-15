import { Card, CardContent, CardHeader } from "@mui/material";
import { Metadata } from "next";

import { NewListing } from "./components/NewListing";

export const metadata: Metadata = {
  title: "Ny vervutlysning",
  description: "Opprett en ny vervutlysning",
};

export default function Page() {
  return (
    <Card>
      <CardHeader title="Ny vervutlysning" />
      <CardContent>
        <NewListing />
      </CardContent>
    </Card>
  );
}
