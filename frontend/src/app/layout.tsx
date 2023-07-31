/** @jsxImportSource react */

import { ApolloWrapper } from "@/lib/apollo";
import { ThemeRegistry } from "@/lib/mui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <ApolloWrapper>{children}</ApolloWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
