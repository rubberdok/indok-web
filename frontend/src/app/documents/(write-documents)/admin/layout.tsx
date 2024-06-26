import { Title } from "@/components/Title";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";
import { Container } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrer dokumenter",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Title
        title="Dokumenter"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Dokumenter", href: "/documents" },
          { name: "Administrer", href: `/documents/admin` },
        ]}
        sx={{ mt: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_DESKTOP_HEIGHT}px` } }}
      />
      <Container>{children}</Container>;
    </>
  );
}
