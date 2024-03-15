import { Container } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mine foreninger",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <Container>{children}</Container>;
}
