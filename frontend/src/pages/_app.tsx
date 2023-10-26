import { EmotionCache } from "@emotion/react";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";

import { PageProps } from "@/lib/apolloClient";
import { initializeDayjs } from "@/lib/dayjs";
import { NextPageWithLayout } from "@/lib/next";
import { AppProvider } from "@/providers";

initializeDayjs();

const Layout = dynamic(() => import("@/layouts/Layout").then((mod) => mod.Layout));

export interface CustomAppProps extends AppProps<PageProps> {
  err: Error;
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
}

const App = (props: CustomAppProps): JSX.Element => {
  const { pageProps, err, Component, emotionCache } = props;
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Head>
        <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
        <meta
          name="description"
          content="Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
             for all studentfrivillighet på masterstudiet Indøk ved NTNU. Arrangementer, verv, 
             og oversikt over det sosiale på Indøk."
        />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <AppProvider pageProps={pageProps} emotionCache={emotionCache}>
        {getLayout(<Component {...pageProps} err={err} />)}
      </AppProvider>
      <Analytics />
    </>
  );
};

export default App;
