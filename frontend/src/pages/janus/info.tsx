import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import { MemberCard } from "@/components/pages/about/MemberCard";
import { BoardMember } from "@/components/pages/about/MemberCard/types";
import { Template } from "@/components/pages/about/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const JanusPage: NextPageWithLayout = () => {
  const boardMembers: BoardMember[] = [
    {
      rank: 1,
      name: "Oskar Gåsø",
      position: "President Janus",
      email: "president@janulinjeforening.no",
    },
    {
      rank: 2,
      name: "Fannar ",
      position: "Janus web.sjef",
      email: "president@janulinjeforening.no",
    },
  ];

  return (
    <Template
      title="Janus"
      description="Janus er indøkslinjeforening..."
      prevPost={{ title: "Våre foreninger", slug: "/about/organizations", cover: "/img/hero.jpg" }}
      nextPost={{ title: "Instituttillitsvalgte", slug: "/about/itv", cover: "/img/hero.jpg" }}
    >
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </Typography>
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Medlemmer
      </Typography>
      <Grid container spacing={2} alignItems="stretch" justifyContent="center">
        {boardMembers.map((member) => (
          <Grid key={member.rank} item xs={12} md={6}>
            <MemberCard member={member} />
          </Grid>
        ))}
      </Grid>
    </Template>
  );
};

JanusPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanusPage;
