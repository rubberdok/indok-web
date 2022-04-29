import { Event } from "@interfaces/events";
import { Box, Container, styled, Typography } from "@mui/material";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { Breadcrumbs } from "..";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

type Props = {
  event: Event;
};

const OrganizationEventHero: React.FC<Props> = (props) => {
  const { event } = props;

  return (
    <RootStyle>
      <Container>
        <Box sx={{ pt: 5, pb: 8 }}>
          <Breadcrumbs
            onDark
            sx={{ mb: 10 }}
            links={[
              { href: "/", name: "Hjem" },
              { href: "/orgs", name: "Organisasjoner" },
              { href: "/orgs/" + event.organization.id, name: event.organization.name },
              { name: event.title },
            ]}
          />
          <Typography variant="overline" color="grey.500">
            Administrer arrangement
          </Typography>
          <Typography variant="h2" component="h1">
            {event.title}
          </Typography>
        </Box>
      </Container>
    </RootStyle>
  );
};

export default OrganizationEventHero;
