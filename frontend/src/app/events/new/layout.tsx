import { Container, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nytt arrangement",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Container>
      <Typography variant="subtitle1" gutterBottom>
        Nytt arrangement
      </Typography>
      {children}
    </Container>
  );
}
