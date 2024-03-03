import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hyttebooking",
  openGraph: {
    images: "/img/hytte.jpg",
  },
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
