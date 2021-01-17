import { CompositionProps } from "@atomic-layout/core";
import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import Content from "@components/ui/Content";
import ImageCard from "@components/ui/ImageCard";
import { Heading, Paragraph, SubHeading } from "@components/ui/Typography";
import { Composition } from "atomic-layout";
import { NextPage } from "next";

const data = [
  {
    id: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    imageUrl: "./img/borsfest.jpg",
    title: "Børsfest: Cash is king",
    subtitle: "Om 6 dager",
  },
  {
    id: "ad782ecdac770fc6eb9a62e44f90873fb97fb26b",
    imageUrl: "./img/woodok.jpg",
    title: "Woodøk i kjent stil",
    subtitle: "20. November",
  },
  {
    id: "b802f384302cb24fbab0a44997e820bf2e8507bb",
    imageUrl: "./img/afterski.jpg",
    title: "Afterski i Bymarka",
    subtitle: "25. November",
  },
  {
    id: "b802f384302cb24fbab0a44994e820bf2e8507bb",
    imageUrl: "./img/afterski.jpg",
    title: "Afterski i Bymarka",
    subtitle: "25. November",
  },
];

const areasTablet = `
  content
  items
  actions
`;

const areasLarge = `
  content items
  actions items
`;

const IndexPage: NextPage = () => (
  <Layout>
    <Hero />
    <Content>
      <br />
      <br />
      <br />
      <br />
      <Composition alignItems="center" areas={areasTablet} areasLg={areasLarge} gap={60} gapRow={20}>
        {({ Areas }: CompositionProps) => (
          <>
            <Areas.Items>
              <SubHeading>Kommende Eventer</SubHeading>
              <Composition
                templateCols="auto"
                templateColsMd="auto auto auto auto"
                templateColsLg="auto"
                gap={10}
                gapLg={15}
              >
                {data.map((item) => (
                  <ImageCard key={item.id} title={item.title} subtitle={item.subtitle} imageUrl={item.imageUrl} />
                ))}
              </Composition>
            </Areas.Items>
            <Areas.Content>
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
            </Areas.Content>
            <Areas.Actions>
              <Button back style="primary" link="/events">
                Se kalenderen
              </Button>
            </Areas.Actions>
          </>
        )}
      </Composition>
      <br />
      <br />
      <br />
      <br />
    </Content>
  </Layout>
);

export default IndexPage;
