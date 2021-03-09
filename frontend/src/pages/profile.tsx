import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { FirstLogin } from "@components/pages/profile/FirstLogin";
import { UPDATE_USER } from "@graphql/auth/mutations";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ProfilePage: NextPage = () => {
  const { loading, error, data } = useQuery<{ user: User }>(GET_USER);

  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>();

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

  const onChange = (key: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUserData({ ...userData, [key]: e.target.value });
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Brukerprofil</Typography>
        {userData ? (
          <>
            <FirstLogin open={dialogOpen} onChange={onChange} />
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
