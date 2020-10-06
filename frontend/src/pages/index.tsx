import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";
import Layout from "@components/Layout";
import { Title, SubTitle, Heading, SubHeading, Paragraph } from "@components/ui/Typography";
import Button from "@components/ui/Button";
import Navbar from "@components/navbar/Navbar";

const IndexPage: NextPage = () => {
    const [session, loading] = useSession();
    if (loading) return <div>loading...</div>;
    return (
        <Layout>
            <Navbar />
            <div>
                <SubTitle>Foreningen for studentene ved</SubTitle>
                <Title>Industriell Økonomi og Teknologiledelse</Title>
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
                <br />
                <SubHeading>Arrangementer</SubHeading>
                <Heading>Hva skjer nå?</Heading>
                <Paragraph>
                    Hovedstyret (HS) er styret i Foreningen for studentene ved Industriell økonomi og teknologiledelse,
                    NTNU. Hovedstyret består av et valgt lederpar, instituttilittsvalgt ved IØT, samt leder for hver av
                    linjeforeningene Janus, Bindeleddet, ESTIEM, Hyttestyret, Janus IF og Indøk Kultur. Hovedstyrets
                    fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike studentinitiativene,
                    og forvalte og disponere Indøks midler på en forsvarlig måte. Hovedstyret er ansvarlig for å
                    forberede og avholde generalforsamling for studentene ved Indøk. Generalforsamlingen er Foreningens
                    øverste organ og er studentenes mulighet til å direkte påvirke budsjetter og avgjørelser som blir
                    fattet på linjen.
                </Paragraph>
                <Button url="/testpage">Les mer om foreningen</Button>
            </div>
            <Link href="/events"> Go to Events</Link>
        </Layout>
    );
};

export default IndexPage;
