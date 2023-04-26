import { Card, CardActionArea, CardContent, CardMedia, Stack, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { GetStaticProps } from "next";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import React from "react";

import { Link } from "@/components";
import { TabPanel } from "@/components/pages/about/TabPanel";
import { Template } from "@/components/pages/about/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";
import { getSortedPosts } from "@/utils/posts";

type Post = {
  frontmatter: {
    title: string;
    image?: string;
    tag?: string;
    logo: string;
  };
  slug: string;
};

type Props = {
  posts: Post[];
} & Post;

const StyledCardMedia = styled(CardMedia)(() => ({
  height: "100px",
  width: "100%",
  backgroundSize: "contain",
  backgroundPosition: "center",
  alignContent: "center",
}));

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

const OrganizationPage: NextPageWithLayout<Props> = ({ posts }) => {
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
      <Stack direction="column" height={460} position="relative">
        <Image src="/img/organisasjonskart2023.svg" alt="Foreningskart" fill />
      </Stack>
      <Typography id="orgList" variant="h3" component="h2" gutterBottom>
        Se foreningene våre under
      </Typography>
      <Tabs indicatorColor="primary" value={value} onChange={pushQuery}>
        {Object.keys(routes).map((keyName, i) => (
          <Tab key={i} label={routes[keyName].title} />
        ))}
      </Tabs>
      <br />

      <TabPanel value={value} index={1}>
        Indøk Kultur er paraplyforeningen for alle kulturaktiviteter på Indøk, og innbefatter Indøkrevyen, Mannskoret
        Klingende Mynt, et Indøk-band (Bandøk), et ølbryggerlag (Indøl) samt en veldedig organisasjon (IVI).
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>
          Fra en sped start som Janus FK i 2006, har foreningen vokst til å forene godt over hundre sporty og engasjerte
          studenter under én felles paraply, med et bredt spekter av idretter. Tilbudet blir stadig bredere, og ønsker
          og idéer til nye lag og idretter tas alltid imot med åpne armer!
        </Typography>
      </TabPanel>

      <Grid container spacing={2}>
        {posts
          .filter((post) => (router.query.category != undefined ? post.frontmatter.tag == router.query.category : post))
          .map(({ frontmatter: { title, logo }, slug }) => (
            <Grid key={slug} item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea
                  href={`/about/organizations/${slug}`}
                  noLinkStyle
                  component={Link}
                  sx={{ height: "100%" }}
                >
                  <CardContent sx={{ justifyContent: "center" }}>
                    {logo ? <StyledCardMedia image={logo} sx={{ mb: 2 }} /> : ""}
                    <Typography variant="body2" textAlign="center">
                      {title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        {(router.query.category == undefined || router.query.category == "annet") && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea href="https://bindeleddet.no/" noLinkStyle component={Link} sx={{ height: "100%" }}>
                  <CardContent sx={{ justifyContent: "center" }}>
                    <StyledCardMedia image="/img/bindeleddetlogo.png" sx={{ mb: 2 }} />
                    <Typography variant="body2" textAlign="center">
                      Bindeleddet
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea
                  href="https://sites.google.com/view/estiem-ntnu"
                  noLinkStyle
                  component={Link}
                  sx={{ height: "100%" }}
                >
                  <CardContent sx={{ justifyContent: "center" }}>
                    <StyledCardMedia image="/img/estiemlogo.png" sx={{ mb: 2 }} />
                    <Typography variant="body2" textAlign="center">
                      ESTIEM
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea
                  href="https://januslinjeforening.no/"
                  noLinkStyle
                  component={Link}
                  sx={{ height: "100%" }}
                >
                  <CardContent sx={{ justifyContent: "center" }}>
                    <StyledCardMedia image="/img/januslogo.png" sx={{ mb: 2 }} />
                    <Typography variant="body2" textAlign="center">
                      Janus
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Template>
  );
};

OrganizationPage.getLayout = (page) => <Layout>{page}</Layout>;

export const getStaticProps: GetStaticProps = async () => {
  const posts = getSortedPosts("organizations");

  return {
    props: {
      posts,
    },
  };
};

export default OrganizationPage;
