import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { EditUser } from "@components/pages/profile/EditUser";
import { FirstLogin } from "@components/pages/profile/FirstLogin";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: { width: "fit-content" },
    content: { marginLeft: theme.spacing(2) },
    avatarBox: { display: "flex", flexDirection: "column", alignItems: "center" },
    userInfoBox: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
  })
);

const ProfilePage: NextPage = () => {
  const { loading, error, data, refetch: refetchUser } = useQuery<{ user: User }>(GET_USER);

  const [firstLoginOpen, setFirstLoginOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const classes = useStyles();
  const router = useRouter();

  if (loading) {
    return <Typography variant="h1">Laster ...</Typography>;
  }

  if (!data || !data.user || error) {
    if (typeof window !== "undefined") {
      // redirect user to homepage if no user data and client side
      router.push("/");
      return null;
    }
  }

  if (data?.user?.firstLogin && !firstLoginOpen) {
    setFirstLoginOpen(true);
  }

  const onSubmit = async () => {
    await refetchUser();
    firstLoginOpen && setFirstLoginOpen(false);
    editUserOpen && setEditUserOpen(false);
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Brukerprofil</Typography>
        {data?.user && (
          <>
            <FirstLogin open={firstLoginOpen} onSubmit={onSubmit} fullName={data?.user?.firstName} />
            <EditUser open={editUserOpen} onSubmit={onSubmit} user={data.user} onClose={() => setEditUserOpen(false)} />
            <Grid container>
              <Grid item xs={6}>
                <Card variant="outlined" className={classes.card}>
                  <CardContent>
                    <Box className={classes.content}>
                      <Box className={classes.avatarBox}>
                        <Avatar>{data.user.firstName[0]}</Avatar>
                        <Typography variant="h4">{`${data.user.firstName} ${data.user.lastName}`}</Typography>
                      </Box>
                      <Box className={classes.userInfoBox}>
                        <Typography variant="body1">
                          <strong>E-post:</strong> {data.user.email || data.user.feideEmail}
                        </Typography>
                        {data.user.phoneNumber && (
                          <Typography variant="body1">
                            <strong>Mobilnummer:</strong> {data.user.phoneNumber}
                          </Typography>
                        )}
                        {data.user.gradeYear && (
                          <Typography variant="body1">
                            <strong>Klassetrinn:</strong>{" "}
                            {`${data.user.gradeYear} (avgangsår ${data.user.graduationYear})`}
                          </Typography>
                        )}
                        {data.user.allergies && (
                          <Typography variant="body1">
                            <strong>Allergier/matpreferanser:</strong> {data.user.allergies}
                          </Typography>
                        )}
                      </Box>
                      {data.user.dateJoined && (
                        <Typography variant="body2">
                          Medlem siden {new Date(data.user.dateJoined).toLocaleString()} <br />
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions className={classes.content}>
                    <Button onClick={() => setEditUserOpen(true)} startIcon={<EditIcon />}>
                      Rediger bruker
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h4">Mine organisasjoner</Typography>
                        <Typography>{`Her kommer en liste over alle organisasjoner ${data.user.firstName} er medlem av`}</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/orgs">
                          <Button>Gå til organisasjoner</Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h4">Mine arrangementer</Typography>
                        <Typography>{`Her kommer en liste over alle arrangementer ${data.user.firstName} har meldt seg på`}</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/events" passHref>
                          <Button>Gå til arrangmenter</Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h4">Mine vervsøknader</Typography>
                        <Typography>{`Her kommer en liste over verv ${data.user.firstName} har søkt på`}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button disabled>Gå til vervsøking</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePage;
