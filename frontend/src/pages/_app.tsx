import { EmotionCache } from "@emotion/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppProps } from "next/app";
import Head from "next/head";

import { Layout } from "@/layouts/Layout";
import { PageProps } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";
import { AppProvider } from "@/providers";

export interface CustomAppProps extends AppProps<PageProps> {
  err: Error;
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
}

const speedInsightsSampleRate = process.env.VERCEL_ENV === "production" ? 1 : 0.1;

const App = (props: CustomAppProps): JSX.Element => {
  const { pageProps, err, Component, emotionCache } = props;
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Head>
        <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
        <meta
          name="description"
          content="Janus Linjeforening er den øverste instansen
             for all studentfrivillighet på masterstudiet Industriell Økonomi og Teknologiledelse ved NTNU. Arrangementer, verv,
             og oversikt over det sosiale på Indøk."
        />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <AppProvider pageProps={pageProps} emotionCache={emotionCache}>
        {getLayout(<Component {...pageProps} err={err} />)}
      </AppProvider>
      <Analytics />
      <SpeedInsights sampleRate={speedInsightsSampleRate} />
    </>
  );
};

export default App;
