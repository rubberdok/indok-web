/** @jsxImportSource react */

import { Metadata } from "next";

import { ApolloWrapper } from "@/lib/apollo";
import { ThemeRegistry } from "@/lib/mui";

import { AppBar } from "./components/Layout/AppBar";
import { Footer } from "./components/Layout/Footer";

export const metadata: Metadata = {
  title: "Indøk NTNU | Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse",
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
      </body>
    </html>
  );
}
