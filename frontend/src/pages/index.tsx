import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import Content from "@components/ui/Content";
import { Heading, Paragraph, SubHeading } from "@components/ui/Typography";
import { NextPage } from "next";

const IndexPage: NextPage = () => (
    <Layout>
        <Hero />
        <Content>
            <br />
            <SubHeading>Arrangementer</SubHeading>
            <Heading>Hva skjer nå?</Heading>
            <Paragraph>
                Hovedstyret (HS) er styret i Foreningen for studentene ved Industriell økonomi og teknologiledelse,
                NTNU. Hovedstyret består av et valgt lederpar, instituttilittsvalgt ved IØT, samt leder for hver av
                linjeforeningene Janus, Bindeleddet, ESTIEM, Hyttestyret, Janus IF og Indøk Kultur. Hovedstyrets fremste
                oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike studentinitiativene, og forvalte
                og disponere Indøks midler på en forsvarlig måte. Hovedstyret er ansvarlig for å forberede og avholde
                generalforsamling for studentene ved Indøk. Generalforsamlingen er Foreningens øverste organ og er
                studentenes mulighet til å direkte påvirke budsjetter og avgjørelser som blir fattet på linjen.
            </Paragraph>
            <Button url="/testpage">Les mer om foreningen</Button>
            <br />
        </Content>
    </Layout>
);

export default IndexPage;
