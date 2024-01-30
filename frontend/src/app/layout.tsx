import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

import { ApolloWrapper } from "@/lib/apollo";
import { ThemeRegistry } from "@/lib/mui";

import { AppBar } from "./v2/components/Layout/AppBar";
import { Footer } from "./v2/components/Layout/Footer";

export const metadata: Metadata = {
  title: "Indøk NTNU | Janus Linjeforening",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-color-scheme="light" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <ApolloWrapper>
            <main className="content">
              <AppBar />
              {children}
            </main>
            <footer className="footer">
              <Footer />
            </footer>
          </ApolloWrapper>
        </ThemeRegistry>
        <Analytics mode={process.env.VERCEL_ENV === "production" ? "production" : "development"} />
      </body>
    </html>
  );
}
