import { CalendarToday, Class, Email, Label, Place } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import Link from "@/components/Link";
import { Markdown } from "@/components/Markdown";
import { Title } from "@/components/Title";
import { EventDetailFieldsFragment } from "@/generated/graphql";

import { SignUp } from "./SignUp";

type Props = {
  event: EventDetailFieldsFragment;
};

function isAttendable(
  event: EventDetailFieldsFragment
): event is EventDetailFieldsFragment & { signupOpenDate: string; deadline: string } {
  return event.isAttendable && Boolean(event.signupOpenDate) && Boolean(event.deadline);
}

export const EventDetails: React.FC<Props> = ({ event }) => {
  return (
    <>
      <Title
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: event.title,
            href: `/events/${event.id}`,
          },
        ]}
        title={event.title}
        overline={`Arrangert av ${event.organization.name}`}
      />
      <Container>
        <Grid container direction="row" justifyContent="space-between" spacing={2}>
          <Grid container xs={12} md={8} direction="column">
            {isAttendable(event) && (
              <Grid xs>
                <SignUp event={event} />
              </Grid>
            )}
            <Grid>
              <Markdown>{event.description}</Markdown>
            </Grid>
          </Grid>
          <Grid md xs={12}>
            <Card>
              <CardHeader title="Informasjon" />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText primary="Starter" secondary={formatDate(event.startTime)} />
                  </ListItem>
                  {event.endTime && (
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText primary="Slutter" secondary={formatDate(event.endTime)} />
                    </ListItem>
                  )}
                  {event.location && (
                    <ListItem>
                      <ListItemIcon>
                        <Place />
                      </ListItemIcon>
                      <ListItemText primary="Sted" secondary={event.location} />
                    </ListItem>
                  )}
                  {event.category && (
                    <ListItem>
                      <ListItemIcon>
                        <Label />
                      </ListItemIcon>
                      <ListItemText primary="Kategori" secondary={event.category.name} />
                    </ListItem>
                  )}
                  {event.allowedGradeYears && (
                    <ListItem>
                      <ListItemIcon>
                        <Class />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography>Klassetrinn</Typography>}
                        secondary={<Chip label={event.allowedGradeYears.join(", ")} color="primary" />}
                        disableTypography
                      />
                    </ListItem>
                  )}
                  <Divider variant="middle" light />
                  {event.contactEmail && (
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary="Kontakt"
                        secondary={<Link href={`mailto:${event.contactEmail}`}>{event.contactEmail}</Link>}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

function formatDate(date: string) {
  return dayjs(date).format("LLL");
}
