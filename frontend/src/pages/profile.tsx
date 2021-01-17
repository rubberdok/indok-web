import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import { Heading, Paragraph, Title } from "@components/ui/Typography";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const ProfilePage: NextPage = () => {
  const { loading, error, data } = useQuery<{ user: User }>(GET_USER);
  const router = useRouter();
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

  return (
    <Layout>
      <Content>
        <Col>
          <Title>Brukerprofil</Title>
          {user ? (
            <div>
              <Heading>{user.firstName}</Heading>
              <Content>
                <Paragraph>
                  <strong>Brukernavn:</strong> {user.username} <br />
                  <strong>E-post:</strong> {user.email} <br />
                  <strong>Klassetrinn:</strong> {user.year} <br />
                </Paragraph>
                <Paragraph>
                  Medlem siden {new Date(user.dateJoined).toLocaleString()} <br />
                </Paragraph>
              </Content>
            </div>
          ) : (
            <div> Du er ikke logget inn! Vennligst logg inn med Feide. </div>
          )}
        </Col>
      </Content>
    </Layout>
  );
};

export default ProfilePage;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;
