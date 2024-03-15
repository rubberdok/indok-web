import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

import { ApolloWrapper } from "@/lib/apollo";
import { ThemeRegistry } from "@/lib/mui";
import { config } from "@/utils/config";

import { AlertsWrapper } from "./components/Alerts";
import { AppBar } from "./components/Layout/AppBar";
import { Footer } from "./components/Layout/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Janus Linjeforening",
    default: "Janus Linjeforening",
  },
};

if (config.APP_ENV === "development") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-color-scheme="light" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <AlertsWrapper>
            <ApolloWrapper>
              <main className="content">
                <AppBar />
                {children}
              </main>
              <footer className="footer">
                <Footer />
              </footer>
            </ApolloWrapper>
          </AlertsWrapper>
        </ThemeRegistry>
        <Analytics mode={process.env.VERCEL_ENV === "production" ? "production" : "development"} />
      </body>
    </html>
  );
}
