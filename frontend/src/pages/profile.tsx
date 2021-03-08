import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { UPDATE_USER } from "@graphql/auth/mutations";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ProfilePage: NextPage = () => {
  const { loading, error, data } = useQuery<{ user: User }>(GET_USER);
  const [updateUser] = useMutation<{
    updateUser: {
      user: User;
    };
  }>(UPDATE_USER);
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateUserInput, setUpdateUserInput] = useState({});
  const [userData, setUserData] = useState<Partial<User>>();

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

  useEffect(() => {
    if (data?.user) {
      setUserData(data.user);

      if (data.user.firstLogin && !dialogOpen) {
        setDialogOpen(true);
      }
    }
  }, [data]);

  const onChange = (key: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUserData({ ...userData, [key]: e.target.value });
    setUpdateUserInput({ ...updateUserInput, [key]: e.target.value });
  };

  const handleSubmit = () => {
    updateUser({
      variables: { updateUserInput },
      update: (cache, { data }) => {
        if (!data || !data.updateUser || !data.updateUser.user) {
          return;
        }
        cache.writeQuery<User>({ query: GET_USER, data: data.updateUser.user });
      },
    });
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Brukerprofil</Typography>
        {userData ? (
          <>
            <Dialog open={dialogOpen} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Første innlogging</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Det ser ut som at dette er første gang du logger inn på nettsiden. Vennligst fyll ut informasjonen
                  under som er nødvendig for å benytte funksjonaliteten på nettsiden.
                </DialogContentText>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Foretrukket e-post (stud-mail brukes dersom annet ikke oppgis)</InputLabel>
                    <TextField
                      id="standard-basic"
                      type="email"
                      name="email"
                      value={userData.feideEmail}
                      onChange={(e) => onChange("email", e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Telefonnummer (nødvendig for smittesporing under arrangementer)</InputLabel>
                    <TextField
                      id="standard-basic"
                      required
                      type="tel"
                      name="phone"
                      value={userData.phoneNumber}
                      onChange={(e) => onChange("phoneNumber", e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Allergier (benyttes ved påmelding på arrangementer)</InputLabel>
                    <TextField
                      id="standard-basic"
                      required
                      type="text"
                      value={userData.allergies}
                      onChange={(e) => onChange("allergies", e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Årstrinn</InputLabel>
                    <TextField
                      id="standard-basic"
                      required
                      type="number"
                      value={userData.year}
                      onChange={(e) => onChange("year", e)}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleSubmit()} color="primary">
                  Send
                </Button>
              </DialogActions>
            </Dialog>
            <Typography variant="h3">{userData.firstName}</Typography>
            <Typography variant="body1">
              <strong>Brukernavn:</strong> {userData.username} <br />
              <strong>E-post:</strong> {userData.email} <br />
              <strong>Klassetrinn:</strong> {userData.year} <br />
            </Typography>
            {userData.dateJoined && (
              <Typography variant="body2">
                Medlem siden {new Date(userData.dateJoined).toLocaleString()} <br />
              </Typography>
            )}
          </>
        ) : (
          <> Du er ikke logget inn! Vennligst logg inn med Feide. </>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePage;
