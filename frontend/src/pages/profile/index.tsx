import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import EventCard from "@components/pages/profile/ProfileCard/variants/EventCard";
import FormCard from "@components/pages/profile/ProfileCard/variants/FormCard";
import OrganizationCard from "@components/pages/profile/ProfileCard/variants/OrganizationCard";
import PersonalCard from "@components/pages/profile/ProfileCard/variants/PersonalCard";
import { GET_USER_PROFILE } from "@graphql/users/queries";
import { Avatar, Container, Grid, Typography, useTheme } from "@material-ui/core";
import { NextPage } from "next";
import { User } from "src/types/users";
import useStyles from "./styles";

const ProfilePage: NextPage = () => {
  const { data, error } = useQuery<{ user: User }>(GET_USER_PROFILE);
  const theme = useTheme();
  const classes = useStyles();

  if (error)
    return (
      <Layout>
        <p>Errror</p>
      </Layout>
    );
  return (
    <Layout>
      <Container>
        <Grid
          container
          direction="column"
          alignItems="center"
          style={{ marginTop: theme.spacing(8), marginBottom: theme.spacing(8) }}
          spacing={2}
        >
          <>
            <Grid item>
              <Avatar className={classes.large}>
                {data && <Typography variant="h3">{`${data.user.firstName[0]}${data.user.lastName[0]}`}</Typography>}
              </Avatar>
            </Grid>
            <Grid
              container
              item
              direction="column"
              alignItems="center"
              xs={10}
              style={{ marginBottom: theme.spacing(4) }}
            >
              <Grid item>{data && <Typography variant="subtitle1">{`Hei, ${data.user.firstName}`}</Typography>}</Grid>
              <Grid item>
                <Typography variant="body2" align="center">
                  Her kan du endre din informasjon, se tidligere arrangementer og organisasjonene der du er medlem.
                </Typography>
              </Grid>
            </Grid>

            <Grid
              container
              item
              className={classes.cards}
              spacing={4}
              justify="center"
              sm={10}
              xs={12}
              alignItems="stretch"
            >
              <Grid item md={6}>
                <PersonalCard user={data?.user} />
              </Grid>
              <Grid item md={6}>
                <EventCard />
              </Grid>
              <Grid item md={6}>
                <OrganizationCard />
              </Grid>
              <Grid item md={6}>
                <FormCard />
              </Grid>
            </Grid>
          </>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ProfilePage;
