"use client";
import { useSuspenseQuery } from "@apollo/client";
import { Stack, Typography } from "@mui/material";

import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { graphql } from "@/gql/app";

import { BookingContact } from "./_components/BookingContact";
import { BookingSemesters } from "./_components/BookingSemesters";
import { Cabins } from "./_components/Cabins";
import { BookingTerms } from "./_components/BookingTerms";

export default function Page() {
  const { data } = useSuspenseQuery(
    graphql(`
      query CabinsAdminSettingsPage_Query {
        ...Cabins_Query
        ...BookingSemesters_Query
        ...BookingContact_Query
        ...BookingTerms_Query
      }
    `)
  );

  return (
    <>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          { name: "Administrer hytter", href: "/cabins/admin" },
          { name: "Innstillinger", href: "/cabins/admin/settings" },
        ]}
      />
      <Typography variant="subtitle1" gutterBottom>
        Innstillinger
      </Typography>
      <Stack direction="column" spacing={4}>
        <Cabins query={data} />
        <BookingSemesters query={data} />
        <BookingContact query={data} />
        <BookingTerms query={data} />
      </Stack>
    </>
  );
}
