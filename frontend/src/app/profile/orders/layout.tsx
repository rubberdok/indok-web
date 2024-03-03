import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ordrehistorikk",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
