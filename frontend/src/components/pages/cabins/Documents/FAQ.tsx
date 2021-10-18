import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Box, Grid } from "@material-ui/core";
import Link from "next/link";

const faqs = [
  {
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
    question: "Hvor lang er avbestillingsfristen?",
    answer: (
      <Typography>
        Avbestillingsfristen er 2 uker før ankomst. Hvis dere avbestiller etter dette, ilegges det en gebyr.
      </Typography>
    ),
  },
  {
    question: "Hvordan booker jeg sengeplasser?",
    answer: <Typography>Det gjøres ved å sende mail til Hyttestyret.</Typography>,
  },
  {
    question: "Hva er forskjellen på de to hyttene?",
    answer: (
      <Typography>
        Hyttene er tilnærmet identiske, men Bjørnen blir gjerne kalt kosehytta og Oksen festhytta, siden Bjørnen er den
        av de to som først blir oppgradert gjennom pågående oppussingsprosjekter.
      </Typography>
    ),
  },
  {
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
    question: "Hva har hyttene av dyner, puter og sengetøy?",
    answer: (
      <Typography>
        Begge hyttene er utstyrt med minimum 18 puter og 18 dyner, men laken og sengetøy (evt. laken og sovepose) må
        medbringes.
      </Typography>
    ),
  },

  {
    question: "Kan jeg ha med meg eksterne venner (ikke-indøkere) til hyttene?",
    answer: (
      <Typography>
        Ja. Såfremt over 50% av deltakerne på turen er indøkere gjelder 50,- for indøkere /100,- for eksterne per natt.
        Hvis det er under 50 % indøkere må man leie hele hytta.
      </Typography>
    ),
  },
  {
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
    question: "Hvordan er ordningen for utvask på hyttene?",
    answer: <Typography>De som har brukt hyttene må alltid vaske ut selv.</Typography>,
  },
  {
    question: "Kan jeg reservere en hytte for min eksterne vennegjeng eller eksterne linjeforening?",
    answer: <Typography>Ja. Dette forutsetter leie av hel hytte, og ekstern pris gjelder, 2700,- per natt.</Typography>,
  },
];

/*
Renders all frequently asked questions regarding the cabins.
*/
const FAQ: React.FC = () => {
  const [expanded, setExpanded] = React.useState<number | false>(false);

  const handleChange = (panel: number) => (_event: React.ChangeEvent<Record<string, unknown>>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid item container xs={12} spacing={5}>
      {faqs.map((faq, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Box>
            <Accordion expanded={expanded === index} onChange={handleChange(index)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>{faq.answer}</AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default FAQ;
