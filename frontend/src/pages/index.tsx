import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";
import styled from "styled-components";
import Layout from "../components/Layout";

const StyledHeader = styled.h1`
    color: ${({ theme }) => theme.colors.primary};
`;

const IndexPage: NextPage = () => {
    const [session, loading] = useSession();
    if (loading) return <div>loading...</div>;

    return (
        <Layout>
            {!session && (
                <>
                    Not signed in <br />
                    <button onClick={signIn}>Sign in</button>
                </>
            )}
            {session && (
                <>
                    Signed in as {session.user.email} <br />
                    <>
                        <img src={session.user.image} className="avatar" alt="user-avatar" />
                        <h1>{session.user.name}</h1>
                    </>
                    <style jsx>{`
                        .avatar {
                            width: 220px;
                            border-radius: 10px;
                        }
                    `}</style>
                    <button onClick={signOut}>Sign out</button>
                </>
            )}
            <div>
                <StyledHeader>Velkommen til Indøkntnu.no </StyledHeader>
                <Link href="/testpage">test link</Link>
            </div>
            <Link href="/events"> Go to Events</Link>
        </Layout>
    );
};

export default IndexPage;
