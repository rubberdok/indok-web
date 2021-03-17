import TabPanel from "@components/pages/about/TabPanel";
import Template from "@components/pages/about/Template";
import { Box, Card, CardActionArea, CardMedia, makeStyles, Tab, Tabs, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { getSortedPosts } from "@utils/posts";
import { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React from "react";

type Props = {
  slug: string;
  frontmatter: {
    title: string;
    image?: string;
    tag?: string;
    logo: string;
  };
  posts: Array<any>;
};

const useStyles = makeStyles(() => ({
  media: {
    height: "100px",
    width: "100%",
    backgroundSize: "contain",
    backgroundPosition: "center",
    alignContent: "center",
  },
  card: {
    display: "flex",
    height: "180px",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center",
  },
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

const OrganizationPage: NextPage<Props> = ({ posts }) => {
  const classes = useStyles();
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
      img="/img/hero.jpg"
      title="Organisasjonene under Hovedstyret"
      page=""
      description="Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
      (moderorganisasjonen) for all studentfrivillighet på masterstudiet Indøk ved NTNU."
    >
      <img src="/img/orgmap.svg" alt="Organisasjonskart"></img>
      <Typography id="orgList" variant="h5" gutterBottom>
        Se organisasjonene våre under
      </Typography>
      <Tabs indicatorColor="primary" value={value} onChange={pushQuery}>
        {Object.keys(routes).map((keyName, i) => (
          <Tab key={i} label={routes[keyName].title} />
        ))}
      </Tabs>
      <br />
      <TabPanel value={value} index={1}>
        Indøk Kultur er paraplyorganisasjonen for alle kulturaktiviteter på Indøk, og innbefatter Indøkrevyen,
        Mannskoret Klingende Mynt, et Indøk-band (Bandøk), et ølbryggerlag (Indøl) samt en veldedig organisasjon (IVI).
      </TabPanel>
      <TabPanel value={value} index={2}>
        Fra en sped start som Janus FK i 2006, har foreningen vokst til å forene godt over hundre sporty og engasjerte
        studenter under én felles paraply, med et bredt spekter av idretter. Tilbudet blir stadig bredere, og ønsker og
        idéer til nye lag og idretter tas alltid imot med åpne armer!
      </TabPanel>

      <Grid container spacing={2}>
        {posts
          .filter((post) => (router.query.category != undefined ? post.frontmatter.tag == router.query.category : post))
          .map(({ frontmatter: { title, logo }, slug }: Props) => (
            <Grid key={slug} item xs={12} sm={6} md={4}>
              <Card>
                <Link href={"/about/organizations/[slug]"} as={`/about/organizations/${slug}`} passHref>
                  <CardActionArea className={classes.card}>
                    {logo ? <CardMedia className={classes.media} image={logo} /> : ""}
                    <Box>
                      <Typography variant="body2">{title}</Typography>
                    </Box>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Template>
  );
};

export const getStaticProps = async () => {
  const posts = getSortedPosts("organizations");

  return {
    props: {
      posts,
    },
  };
};

export default OrganizationPage;
