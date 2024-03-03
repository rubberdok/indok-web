import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mine påmeldinger",
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
