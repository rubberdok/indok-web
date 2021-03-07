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
import React, { useState } from "react";

const ProfilePage: NextPage = () => {
  const { loading, error, data } = useQuery<{ user: User }>(GET_USER);
  const [updateUser] = useMutation<{
    user: User;
  }>(UPDATE_USER);
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateUserInput, setUpdateUserInput] = useState({});

  if (loading) {
    return <h1>Loading ...</h1>;
  }
  if (!data || !data.user || error) {
    if (typeof window !== "undefined") {
      // redirect user to homepage if no user data and client side
      router.push("/");
      return null;
    }
  }
  const user = data?.user;

  if (user?.firstLogin && !dialogOpen) {
    console.log("ye");
    setDialogOpen(true);
  }

  const handleSubmit = () => {
    updateUser({
      variables: { updateUserInput },
      update: (cache, { updateUserData }) => {
        if (!updateUserData || !updateUserData.updateUser || !updateUserData.updateUser.user) {
          return;
        }
        cache.writeQuery<User>({ query: GET_USER, data: updateUserData.updateUser.user });
      },
    });
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Brukerprofil</Typography>
        {user ? (
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
                      value={user.feideEmail}
                      onChange={(e) => setUpdateUserInput({ ...updateUserInput, email: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Telefonnummer (nødvendig for smittesporing under arrangementer)</InputLabel>
                    <TextField
                      id="standard-basic"
                      required
                      type="tel"
                      value={user.phoneNumber}
                      onChange={(e) => setUpdateUserInput({ ...updateUserInput, phoneNumber: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Allergier (benyttes ved påmelding på arrangementer)</InputLabel>
                    <TextField
                      id="standard-basic"
                      required
                      type="tel"
                      value={user.allergies}
                      onChange={(e) => setUpdateUserInput({ ...updateUserInput, allergies: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Årstrinn</InputLabel>
                    <TextField
                      id="standard-basic"
                      required
                      type="tel"
                      value={user.year}
                      onChange={(e) => setUpdateUserInput({ ...updateUserInput, year: e.target.value })}
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
            <Typography variant="h3">{user.firstName}</Typography>
            <Typography variant="body1">
              <strong>Brukernavn:</strong> {user.username} <br />
              <strong>E-post:</strong> {user.email} <br />
              {/* <strong>Klassetrinn:</strong> {user.year} <br /> */}
            </Typography>
            <Typography variant="body2">
              Medlem siden {new Date(user.dateJoined).toLocaleString()} <br />
            </Typography>
          </>
        ) : (
          <> Du er ikke logget inn! Vennligst logg inn med Feide. </>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePage;
