import { Box, Divider, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { listItemClasses } from "@mui/material/ListItem";

import { Template } from "@/components/pages/about/Template";
import { NextPageWithLayout } from "@/lib/next";

const AboutPage: NextPageWithLayout = () => {
  return (
    <>
      <Template
        title="Om oss"
        description="Janus Linjeforening er den øverste instansen
      (moderforeningen) for all studentfrivillighet på masterstudiet Industriell Økonomi og Teknologiledelse ved NTNU."
        nextPost={{ title: "Våre foreninger", slug: "/about/organization" }}
      >
        <Typography variant="body1" paragraph>
          Janus Linjeforening er den øverste instansen («moderforeningen») for all studentfrivillighet på masterstudiet
          Industriell Økonomi og Teknologiledelse ved NTNU. Foreningen drives av over 200 ivrige sjeler og over 20 ulike
          underforeninger, hvor alt fra veldedighet og ølbrygging til fadderuker og case-trening står på agendaen.
        </Typography>
        <Typography variant="body1" paragraph>
          Foreningen ledes av Hovedstyret, som forvalter midlene og fungerer som et koordinerende forum mellom de ulike
          studentforeningene. Hovedstyret består av et valgt lederpar, lederne for hver av de større studentforeningene
          på Indøk og instituttillitsvalgt på IØT. Generalforsamlingen er Foreningens øverste myndighet, hvor alle
          studentene på Indøk har stemmerett.
        </Typography>
        <Typography variant="h3" component="h2" gutterBottom>
          Historie
        </Typography>
        <Typography variant="body1" paragraph>
          Foreningen er formaliseringen av all foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi
          si at Foreningen har eksistert så lenge studentfrivilligheten på Indøk har det.
        </Typography>
        <Typography variant="body1" paragraph>
          Allerede på det første Indøk-kullet i 86´ ble næringslivskontakten Bindeleddet startet. I år 2000 hadde man
          den første festen på Janus-kjellerne. I løpet av de neste 20 årene skulle flere titalls tilbud bli startet,
          med alt fra veldedighet og ølbrygging til fadderuker og case-trening på agendaen.
        </Typography>
        <Paper>
          <Box p={4} my={3}>
            <Typography variant="body1">
              En detaljert historie om all foreningsaktivitet på Indøk er under utarbeidelse. Har du eksklusiv kunnskap
              om denne? Send en mail til leder@indokhs.no
            </Typography>
          </Box>
        </Paper>

        <Typography variant="h3" component="h2" gutterBottom>
          Foreningens formål
        </Typography>
        <Typography variant="body1">Fra vedtektene:</Typography>

        <blockquote>
          <Typography variant="body1" paragraph>
            <i>
              «Foreningens formål [..] å støtte den samlede studentmassen på sivilingeniørstudiet Industriell Økonomi og
              Teknologiledelse ved Norges Teknisk- Naturvitenskapelige Universitet (NTNU). Foreningens virksomhet skal
              ubetinget basere seg på ideelle målsetninger, og all økonomisk støtte fra foreningen skal være av
              allmennyttig art og tjene den jevne student ved studiet. Foreningen skal ikke drive ervervsmessig
              virksomhet.»
            </i>
          </Typography>
        </blockquote>

        <Typography variant="h3" component="h2" gutterBottom>
          Hovedstyret
        </Typography>
        <Typography variant="body1" paragraph>
          Hovedstyret (HS) er styret i Janus Linjeforening ved Industriell Økonomi og Teknologiledelse, NTNU. Styrets
          fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike studentinitiativene, samt
          forvalte og disponere Indøks midler på en forsvarlig måte.
        </Typography>
        <Typography variant="body1" paragraph>
          Hovedstyret er videre ansvarlig for å forberede og avholde generalforsamling for studentene ved Indøk.
          Generalforsamlingen er Foreningens øverste organ og er studentenes mulighet til å direkte påvirke budsjetter
          og avgjørelser som blir fattet på linjen.
        </Typography>

        <Typography variant="body1" paragraph>
          Opp gjennom historien har Foreningen hatt følgende lederpar:{" "}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: "hidden",
            my: 2,
          }}
        >
          <Box sx={{ px: 3, py: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Lederpar og ledertrio
            </Typography>
          </Box>

          <Divider />

          <List disablePadding>
            {[
              { year: "2008-2009", names: "Ole Heliesen og Georg Øiesvold" },
              { year: "2009-2010", names: "Magnus Valmot og Ole-Christen Enger" },
              { year: "2010-2011", names: "Thomas Eide og Ole-Daniel Nitter" },
              { year: "2011-2012", names: "Michael Wiik og Iver Roen Velo" },
              { year: "2012-2013", names: "Anja Graff Nesse og Steinar H. Fretheim" },
              { year: "2013-2014", names: "Ove Mørch og Christian Fredrik Scheel" },
              { year: "2014-2015", names: "Lars Arild Wold og Marianne Engseth" },
              { year: "2015-2016", names: "Marius Lie Morken og Hanne Sandven" },
              { year: "2016-2017", names: "Simen Nygaard Hansen og Kristoffer Birkeland" },
              { year: "2017-2018", names: "Gard Rystad og Vemund Wøien" },
              { year: "2018-2019", names: "Daniel Kittilsen Henriksen og Amanda Borge Byrkjeland" },
              { year: "2019-2020", names: "Peder Gjerstad og Mette Liset" },
              { year: "2020-2021", names: "Andreas Johannesen og Lars Lien Ankile" },
              { year: "2021-2022", names: "Christian August Brask Rustad og Olaf Alexander Styrmoe" },
              { year: "2022-2023", names: "Morten Vinje og Erlend Heir" },
              { year: "2023-2024", names: "Olav Bjørlykke, Tord Johan Espe og Arnas Tribusininas" },
              { year: "2024-2025", names: "Kristoffer Grude, Branny Lin og Markus Kile Søyland" },
              { year: "2025-2026", names: "Jens Eggen Skaug, Herman Hytta Gunnarsen og Simen Petersson" },
            ].map((item, idx, arr) => (
              <Box key={item.year}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 1.5,
                    display: "flex",
                    gap: 2,
                    alignItems: "baseline",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {item.names}
                      </Typography>
                    }
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    {item.year}
                  </Typography>
                </ListItem>

                {idx !== arr.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      </Template>
    </>
  );
};

export default AboutPage;
