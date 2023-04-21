import { Container, Divider, Stack, Typography } from "@mui/material";

import { PermissionRequired } from "@/components/Auth";
import { BookingSemesterPicker } from "@/components/pages/cabins/Admin/BookingSemesterPicker";
import { CabinInfoPicker } from "@/components/pages/cabins/Admin/CabinInfoPicker";
import { Title } from "@/components/Title";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const SettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <Title
        title="Innstillinger"
        overline="Bookinger"
        variant="dark"
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: "Hytter",
            href: "/cabins",
          },
          {
            name: "Adminside",
            href: "/cabins/admin",
          },
          {
            name: "Innstillinger",
            href: "/cabins/admin/settings",
          },
        ]}
      />
      <Container>
        <PermissionRequired permission="cabins.change_bookingsemester">
          <Stack direction="column" spacing={4}>
            <Stack direction="column" spacing={2}>
              <Typography variant="h4" component="h2">
                Start- og sluttdato for høst- og vårsemester
              </Typography>
              <Typography>Det vil kun være mulig for brukere å søke om bookinger i disse periodene.</Typography>
              <BookingSemesterPicker />
            </Stack>
            <Divider />
            <Stack direction="column" spacing={2}>
              <Typography variant="h4" component="h2">
                Administrer hytteinformasjon
              </Typography>
              <Typography>Her kan dere oppdatere informasjonen som skal vises om Oksen og Bjørnen.</Typography>
              <CabinInfoPicker />
            </Stack>
          </Stack>
        </PermissionRequired>
      </Container>
    </>
  );
};

SettingsPage.getLayout = (page) => <Layout>{page}</Layout>;

export default SettingsPage;
