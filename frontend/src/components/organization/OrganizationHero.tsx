import { Organization } from "@interfaces/organizations";
import { Box, Container, styled, Tab, Tabs, Typography } from "@mui/material";
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
  organization: Organization;
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
};

const OrganizationHero: React.FC<Props> = (props) => {
  const { organization, handleTabChange, activeTab } = props;

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
              { name: organization.name },
            ]}
          />
          <Typography variant="overline" color="grey.500">
            Administrasjonsside
          </Typography>
          <Typography variant="h2" component="h1">
            {organization.name}
          </Typography>
        </Box>
        <Tabs textColor="secondary" indicatorColor="secondary" onChange={handleTabChange} value={activeTab}>
          <Tab
            sx={{ color: "grey.500", "&.Mui-selected": { color: "secondary.main" } }}
            label={
              <Typography variant="subtitle2" mb={2}>
                Arrangementer
              </Typography>
            }
          />
          <Tab
            sx={{ color: "grey.500", "&.Mui-selected": { color: "secondary.main" } }}
            label={
              <Typography variant="subtitle2" mb={2}>
                Verv
              </Typography>
            }
          />
        </Tabs>
      </Container>
    </RootStyle>
  );
};

export default OrganizationHero;
