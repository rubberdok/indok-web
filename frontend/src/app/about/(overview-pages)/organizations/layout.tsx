import { Container } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foreninger",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <Container>{children}</Container>;
}
