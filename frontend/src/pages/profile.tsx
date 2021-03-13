import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
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
  makeStyles,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    card: { width: "fit-content" },
  })
);

const ProfilePage: NextPage = () => {
  const { loading, error, data, refetch: refetchUser } = useQuery<{ user: User }>(GET_USER);

  const [dialogOpen, setDialogOpen] = useState(false);
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

  if (data?.user?.firstLogin && !dialogOpen) {
    console.log("ye");
    console.log("loading", loading);
    setDialogOpen(true);
  }

  const onFirstLoginSubmit = async () => {
    await refetchUser();
    setDialogOpen(false);
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Brukerprofil</Typography>
        {data?.user && (
          <>
            <FirstLogin open={dialogOpen} onSubmit={onFirstLoginSubmit} />
            <Card variant="outlined" className={classes.card}>
              <CardContent>
                <Box style={{ display: "flex", justifyContent: "center" }}>
                  <Avatar>{data.user.firstName[0]}</Avatar>
                </Box>
                <Typography variant="h4">{data.user.firstName}</Typography>
                <Typography variant="body1">
                  <strong>Brukernavn:</strong> {data.user.username}
                </Typography>
                <Typography variant="body1">
                  <strong>E-post:</strong> {data.user.email || data.user.feideEmail}
                </Typography>
                {data.user.phoneNumber && (
                  <Typography variant="body1">
                    <strong>Mobilnummer:</strong> {data.user.phoneNumber}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Klassetrinn:</strong> {`${data.user.gradeYear} (avgangsår ${data.user.graduationYear})`}
                </Typography>
                {data.user.allergies && (
                  <Typography variant="body1">
                    <strong>Allergier/matpreferanser:</strong> {data.user.allergies}
                  </Typography>
                )}
                {data.user.dateJoined && (
                  <Typography variant="body2">
                    Medlem siden {new Date(data.user.dateJoined).toLocaleString()} <br />
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button startIcon={<EditIcon />}>Rediger bruker</Button>
              </CardActions>
            </Card>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePage;
