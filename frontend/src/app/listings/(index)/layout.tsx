import { Container } from "@mui/material";

import { Title } from "@/components/Title";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Title
        title="Verv"
        sx={{ mt: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_DESKTOP_HEIGHT}px` } }}
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: "/listings", name: "Verv" },
        ]}
      />
      <Container>{children}</Container>
    </>
  );
}
