import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Container, Typography } from "@mui/material";

export default function Layout({ children, params }: React.PropsWithChildren<{ params: { orderId: string } }>) {
  const { orderId } = params;
  return (
    <>
      <Container>
        <Breadcrumbs
          links={[
            { name: "Hjem", href: "/" },
            { name: "Betaling", href: `/checkout/${orderId}` },
          ]}
        />
        <Typography variant="subtitle1">Betaling</Typography>
        {children}
      </Container>
      ;
    </>
  );
}
