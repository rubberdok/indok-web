import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { FirstLogin } from "@components/pages/profile/FirstLogin";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import {
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
import React, { useEffect, useState } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    card: { width: "fit-content" },
  })
);

const ProfilePage: NextPage = () => {
  const { loading, error, data, refetch: refetchUser } = useQuery<{ user: User }>(GET_USER);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>();
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    if (data?.user) {
      setUserData(data.user);

      if (data.user.firstLogin && !dialogOpen) {
        setDialogOpen(true);
      }
    }
  }, [data]);

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

  const onFirstLoginSubmit = (refetch: boolean) => {
    setDialogOpen(false);
    refetch && refetchUser();
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Brukerprofil</Typography>
        <Card variant="outlined" className={classes.card}>
          {userData ? (
            <>
              <FirstLogin open={dialogOpen} onSubmit={onFirstLoginSubmit} />
              <CardContent>
                <Typography variant="h3">{userData.firstName}</Typography>
                <Typography variant="body1">
                  <strong>Brukernavn:</strong> {userData.username}
                </Typography>
                <Typography variant="body1">
                  <strong>E-post:</strong> {userData.email || userData.feideEmail}
                </Typography>
                {userData.phoneNumber && (
                  <Typography variant="body1">
                    <strong>Mobilnummer:</strong> {userData.phoneNumber}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Klassetrinn:</strong> {userData.year}
                </Typography>
                {userData.allergies && (
                  <Typography variant="body1">
                    <strong>Allergier/matpreferanser:</strong> {userData.allergies}
                  </Typography>
                )}
                {userData.dateJoined && (
                  <Typography variant="body2">
                    Medlem siden {new Date(userData.dateJoined).toLocaleString()} <br />
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button startIcon={<EditIcon />}>Rediger bruker</Button>
              </CardActions>
            </>
          ) : (
            <> Du er ikke logget inn! Vennligst logg inn med Feide. </>
          )}
        </Card>
      </Container>
    </Layout>
  );
};

export default ProfilePage;
