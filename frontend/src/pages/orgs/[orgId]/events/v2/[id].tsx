import { useQuery } from "@apollo/client";
import { Container, Grid } from "@mui/material";
import { useRouter } from "next/router";

import { Attendees, EventInformation, Waitlist } from "@/components/pages/orgs/events";
import { Title } from "@/components/Title";
import { AdminEventDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const AdminEventPage: NextPageWithLayout = () => {
  const { id } = useRouter().query;

  const { loading, data } = useQuery(AdminEventDocument, {
    variables: { id: typeof id === "string" ? id : "" },
  });

  const event = data?.event;

  if (loading) {
    return (
      <Title
        overline="Administrer arrangement"
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: "/orgs", name: "Foreninger" },
        ]}
        variant="dark"
      />
    );
  }

  if (event) {
    return (
      <>
        <Title
          title={event.title}
          overline="Administrer arrangement"
          breadcrumbs={[
            { href: "/", name: "Hjem" },
            { href: "/orgs", name: "Foreninger" },
            { href: `/orgs/${event.organization.id}`, name: event.organization.name },
            { name: event.title },
          ]}
          variant="dark"
        />
        <Container>
          <Grid container direction="row" spacing={2} alignItems="flex-start">
            <Grid container item md sm={12}>
              <EventInformation event={event} />
            </Grid>
            {event.isAttendable && (
              <Grid container item sm={12} md={7} lg={8}>
                <Attendees attendees={event.usersAttending ?? []} tickets={Boolean(event.product)} eventId={event.id} />
              </Grid>
            )}
          </Grid>
          <Waitlist />
        </Container>
      </>
    );
  }

  return null;
};

AdminEventPage.getLayout = (page) => <Layout>{page}</Layout>;

export default AdminEventPage;
