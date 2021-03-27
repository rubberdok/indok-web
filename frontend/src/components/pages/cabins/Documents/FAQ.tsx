import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Grid } from "@material-ui/core";
import { Box } from "atomic-layout";
import Link from "next/link";

const faqs = [
  {
    id: "1",
    question: "Hva er adressen til hyttene?",
    answer: (
      <Typography>
        Hyttene ligger rett ved Stølen alpintanlegg, med adresse Landsbygrenda A2 (Bjørnen) og A3 (Oksen), 7340 Oppdal.{" "}
        <Link href="https://www.google.no/maps/place/Indøkhyttene/@62.6171078,9.7283935,17z/data=!3m1!4b1!4m2!3m1!1s0x461353ba19f36609:0xeb5dc9d44df09459">
          Vis kart.
        </Link>
      </Typography>
    ),
  },
  {
    id: "2",
    question: "Hvordan kommer jeg meg til hyttene?",
    answer: (
      <Typography>
        Du kan ta tog/buss til Oppdal og taxi opp til hytta, eller kjøre bil hele veien. Transportalternativer finner du
        under <Link href="/cabins">her.</Link>
      </Typography>
    ),
  },
  {
    id: "3",
    question: "Hva er forskjellen på de to hyttene?",
    answer: (
      <Typography>
        Hyttene er tilnærmet identiske, men Bjørnen blir gjerne kalt kosehytta og Oksen festhytta, siden Bjørnen er den
        av de to som først blir oppgradert gjennom pågående oppussingsprosjekter.
      </Typography>
    ),
  },
  {
    id: "4",
    question: "Hva er den totale kapasiteten på hyttene?",
    answer: (
      <Typography>
        Vi har satt total kapasitet til 18 personer, fordelt på 15 sengeplasser og 3 madrasser. Det skal være flere
        madrasser enn dette tilgjengelig på hyttene, men det anbefales å ikke overstige dette antallet pga
        plassbegrensninger rundt kjøkkenbordet o.l.
      </Typography>
    ),
  },
  {
    id: "5",
    question: "Hva har hyttene av dyner, puter og sengetøy?",
    answer: (
      <Typography>
        Begge hyttene er utstyrt med minimum 18 puter og 18 dyner, men laken og sengetøy (evt. laken og sovepose) må
        medbringes.
      </Typography>
    ),
  },
  {
    id: "6",
    question: "Hva kan man finne på i Oppdal?",
    answer: (
      <Typography>
        Mange aktiviteter tilbys av eksterne aktører, se Hytteinformasjon for videre info. Oppdal ligger på østkanten av
        Trollheimen, og det er mange flotte dagsturer å velge mellom med dette utgangspunktet. Det skal ligge kart over
        området tilgjengelig på hyttene.
      </Typography>
    ),
  },
  {
    id: "7",
    question: "Kan jeg reservere en hytte for min eksterne vennegjeng eller eksterne linjeforening?",
    answer: (
      <Typography>
        Ja. Dette forutsetter leie av hel hytte, og ekstern pris gjelder, 2700,- per natt. Slike forespørsler vil ha
        laveste prioritet, men utenfor høysesong er det stort sett ledig kapasitet. Booking foregår via mail til
        bookingansvarlig.
      </Typography>
    ),
  },

  {
    id: "8",
    question: "Kan jeg ha med meg eksterne venner (ikke-indøkere) til hyttene?",
    answer: (
      <Typography>
        Ja. Såfremt over 50% av deltakerne på turen er indøkere gjelder 50,- for indøkere /100,- for eksterne per natt.
        Hvis det er under 50 % indøkere må man leie hele hytta.
      </Typography>
    ),
  },
  {
    id: "9",
    question: "Hvor mye må jeg betale om jeg mister nøklene?",
    answer: (
      <Typography>
        Den som er nøkkelansvarlig er ansvarlig for nøklene. Dersom disse går tapt vil Hyttestyret fakturere den
        nøkkelansvarlige et gebyr på 1000,-. Hyttestyret tar ikke stilling til hvorvidt de andre gjestene bidrar til å
        dekke gebyret.
      </Typography>
    ),
  },
  {
    id: "10",
    question: "Hvordan er ordningen for utvask på hyttene?",
    answer: <Typography>De som har brukt hyttene må alltid vaske ut selv.</Typography>,
  },
  {
    id: "11",
    question: "Hva er kontonummeret til hyttestyret?",
    answer: <Typography>9235.28.31311</Typography>,
  },
];

const FAQ = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (_event: React.ChangeEvent<Record<string, unknown>>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h3" align="center">
          FAQ
        </Typography>
      </Grid>

      <Grid item container xs={12} spacing={5}>
        {faqs.map((faq) => (
          <Grid item xs={12} md={6} key={faq.id}>
            <Box>
              <Accordion expanded={expanded === faq.id} onChange={handleChange(faq.id)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>{faq.answer}</AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default FAQ;
