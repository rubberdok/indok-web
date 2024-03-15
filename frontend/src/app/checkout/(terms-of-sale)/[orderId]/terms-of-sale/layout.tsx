import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Container } from "@mui/material";

export default function Layout({ children, params }: React.PropsWithChildren<{ params: { orderId: string } }>) {
  return (
    <Container>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          { name: "Betaling", href: `/checkout/${params.orderId}` },
          { name: "Salgsbetingelser", href: `/checkout/${params.orderId}/terms-of-sale` },
        ]}
      />
      <Container maxWidth="md" disableGutters>
        {children}
      </Container>
    </Container>
  );
}
