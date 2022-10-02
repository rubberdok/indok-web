import { Tab, Tabs, Typography } from "@mui/material";

import Title from "@components/Title";
import { Organization } from "@interfaces/organizations";

type Props = {
  organization: Organization;
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
};

const OrganizationHero: React.FC<Props> = ({ organization, handleTabChange, activeTab }) => {
  return (
    <Title
      title={organization.name}
      overline="Administrasjonsside"
      breadcrumbs={[{ href: "/", name: "Hjem" }, { href: "/orgs", name: "Foreninger" }, { name: organization.name }]}
      variant="dark"
    >
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
    </Title>
  );
};

export default OrganizationHero;
