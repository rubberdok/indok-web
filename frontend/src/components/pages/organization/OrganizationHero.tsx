import { Tab, Tabs, Typography } from "@mui/material";

import { Title } from "@/components/Title";
import { AdminOrganizationFragment } from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
};

export const OrganizationHero: React.FC<React.PropsWithChildren<Props>> = ({
  organization,
  handleTabChange,
  activeTab,
}) => {
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
        <Tab
          sx={{ color: "grey.500", "&.Mui-selected": { color: "secondary.main" } }}
          label={
            <Typography variant="subtitle2" mb={2}>
              Medlemmer
            </Typography>
          }
        />
      </Tabs>
    </Title>
  );
};
