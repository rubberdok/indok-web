import { Analytics } from "@vercel/analytics/react";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { Metadata } from "next";

import { ApolloWrapper } from "@/lib/apollo";
import { ThemeRegistry } from "@/lib/mui";

import { AppBar } from "./components/Layout/AppBar";
import { Footer } from "./components/Layout/Footer";

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URI ?? "https://www.indokntnu.no";

export const metadata: Metadata = {
  title: "Indøk NTNU | Janus Linjeforening",
  metadataBase: new URL(frontendUrl),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-color-scheme="light" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode="system"
          colorSchemeStorageKey="color-scheme"
          modeStorageKey="mode"
          attribute="data-color-scheme"
        />
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
