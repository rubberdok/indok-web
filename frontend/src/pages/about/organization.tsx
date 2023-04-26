import { Box, Card, CardActionArea, CardContent, CardMedia, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import React from "react";

import { NextLinkComposed } from "@/components/Link";
import { TabPanel } from "@/components/pages/about/TabPanel";
import { Template } from "@/components/pages/about/Template";
import { NextPageWithLayout } from "@/lib/next";
import { Article, getSortedPosts } from "@/utils/posts";

type InternalProps = {
  slug: string;
  href?: never;
};

type ExternalProps = {
  slug?: never;
  href: string;
};

type Props = {
  organization: {
    title: string;
    logo?: string;
  };
} & (InternalProps | ExternalProps);

const OrganizationCard: React.FC<Props> = ({ organization, slug, href }) => {
  const to = typeof slug !== "undefined" ? `/about/organizations/${slug}` : href;
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea to={to} component={NextLinkComposed} sx={{ height: "100%" }}>
        {organization.logo && (
          <CardMedia sx={{ position: "relative", height: "150px" }}>
            <Image src={organization.logo} alt={organization.title} fill style={{ objectFit: "contain" }} />
          </CardMedia>
        )}
        <CardContent>
          <Typography variant="body1" textAlign="center">
            {organization.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const routes: { [key: string]: { id: number; title: string } } = {
  alle: {
    id: 0,
    title: "Alle",
  },
  kultur: {
    id: 1,
    title: "Kultur",
  },
  idrett: {
    id: 2,
    title: "Idrett",
  },
  annet: {
    id: 3,
    title: "Annet",
  },
};

const OrganizationPage: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = ({ posts }) => {
  const router = useRouter();
  const value = typeof router.query.category == "string" ? routes[router.query.category].id : 0;

  const pushQuery = (_: React.ChangeEvent<any>, value: number) => {
    if (value != 0) {
      Router.push(
        {
          pathname: "/about/organization",
          query: { category: Object.keys(routes)[value] },
        },
        undefined,
        { shallow: true, scroll: false }
      );
    } else {
      Router.push(
        {
          pathname: "/about/organization",
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
  };

  return (
    <Template
      title="Foreningene under Hovedstyret"
      description="Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
      (moderforeningen) for all studentfrivillighet på masterstudiet Indøk ved NTNU."
      prevPost={{ title: "Om oss", slug: "/about", cover: "/img/hero.jpg" }}
      nextPost={{ title: "Les om Hovedstyret", slug: "/about/board", cover: "/img/hero.jpg" }}
    >
      <Box height={460} position="relative">
        <Image src="/img/organisasjonskart2023.svg" alt="Foreningskart" fill priority />
      </Box>

      <Typography variant="h3" component="h2" gutterBottom>
        Se foreningene våre under
      </Typography>

      <Tabs indicatorColor="primary" value={value} onChange={pushQuery} sx={{ mb: 2 }}>
        {Object.entries(routes).map(([, { id, title }]) => (
          <Tab key={id} label={title} />
        ))}
      </Tabs>

      <TabPanel value={value} index={1}>
        <Card variant="outlined" elevation={0} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>
              Indøk Kultur er paraplyforeningen for alle kulturaktiviteter på Indøk, og innbefatter Indøkrevyen,
              Mannskoret Klingende Mynt, et Indøk-band (Bandøk), et ølbryggerlag (Indøl) samt en veldedig organisasjon
              (IVI).
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Card variant="outlined" elevation={0} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>
              Fra en sped start som Janus FK i 2006, har foreningen vokst til å forene godt over hundre sporty og
              engasjerte studenter under én felles paraply, med et bredt spekter av idretter. Tilbudet blir stadig
              bredere, og ønsker og idéer til nye lag og idretter tas alltid imot med åpne armer!
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <Grid container spacing={2}>
        {posts
          .filter((post) => (router.query.category != undefined ? post.frontmatter.tag == router.query.category : post))
          .map(({ frontmatter: { title, logo }, slug }) => (
            <Grid key={slug} item xs={12} sm={6} md={4}>
              <OrganizationCard organization={{ title, logo }} slug={slug} />
            </Grid>
          ))}
        {(router.query.category == undefined || router.query.category == "annet") && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <OrganizationCard
                organization={{ title: "Bindeleddet", logo: "/img/bindeleddetlogo.png" }}
                href="https://bindeleddet.no/"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <OrganizationCard
                organization={{ title: "ESTIEM", logo: "/img/estiemlogo.png" }}
                href="https://sites.google.com/view/estiem-ntnu"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <OrganizationCard
                organization={{ title: "Janus", logo: "/img/januslogo.png" }}
                href="https://januslinjeforening.no/"
              />
            </Grid>
          </>
        )}
      </Grid>
    </Template>
  );
};

export const getStaticProps: GetStaticProps<{ posts: Article[] }> = async () => {
  const posts = getSortedPosts("organizations");

  return {
    props: {
      posts,
    },
  };
};

export default OrganizationPage;
