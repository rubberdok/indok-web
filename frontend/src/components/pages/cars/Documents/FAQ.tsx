import { ExpandMore } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";

import { Link } from "@/components";

const faqs = [
  {
    question: "Er bilen manuell eller automat?",
    answer: <Typography>Bilen er manuell. </Typography>,
  },
  {
    question: "Hvor lang er avbestillingsfristen?",
    answer: (
      <Box>
        <Typography>Følgende regler gjelder for avbestilling av en booking:</Typography>
        <ul>
          <li>
            <Typography>Avbestilling innen to uker før bestilt ankomstdato er gebyrfritt.</Typography>
          </li>
          <li>
            <Typography>Avbestilling etter dette medfører et gebyr på 30% av leien.</Typography>
          </li>
        </ul>
      </Box>
    ),
  },
  {
    question: "Hvor mange plasser er det i bilen?",
    answer: <Typography>Det er X plasser i bilen.</Typography>,
  },
  {
    question: "Hva kan man finne på i Oppdal?",
    answer: (
      <Typography>
        Mange aktiviteter tilbys av eksterne aktører, se Aktiviteter for videre info. Oppdal ligger på østkanten av
        Trollheimen, og det er mange flotte dagsturer å velge mellom med dette utgangspunktet.
      </Typography>
    ),
  },
  {
    question: "Hva har hyttene av dyner, puter og sengetøy?",
    answer: (
      <Typography>
        Begge hyttene er utstyrt med minimum 18 puter og 18 dyner, men laken og sengetøy (evt. sovepose) må medbringes.
      </Typography>
    ),
  },

  {
    question: "Kan jeg ha med meg eksterne venner (ikke-indøkere) i bilen?",
    answer: (
      <Typography>
        Ja. Det er egne priser for eksterne gjester. Hvis det skal bookes sengeplasser må det være med en indøker på
        turen. Hvis over 50 % av gjestene er eksterne, og hele hytta skal bookes, må det betales ekstern-pris.
      </Typography>
    ),
  },
  {
    question: "Hvor mye må jeg betale om jeg mister nøklene?",
    answer: (
      <Typography>
        Den som er nøkkelansvarlig er ansvarlig for nøklene. Dersom disse går tapt vil Hytteforeningen fakturere den
        nøkkelansvarlige et gebyr på 1000,-. Hytteforeningen tar ikke stilling til hvorvidt de andre gjestene bidrar til
        å dekke gebyret.
      </Typography>
    ),
  },
  {
    question: "Hvordan er ordningen for utvask på hyttene?",
    answer: (
      <Typography>
        De som har brukt hyttene må alltid vaske ut selv. Det er veldig viktig at alle vinduer lukkes og dører låses.
      </Typography>
    ),
  },
  {
    question: "Kan jeg leie bil for min eksterne vennegjeng?",
    answer: <Typography>Svar</Typography>,
  },
];

/** Renders all frequently asked questions regarding the cabins. */
export const FAQ: React.FC = () => {
  const [expandedPanel, setExpandedPanel] = React.useState<number>();

  const handleChange = (panel: number) => (_: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
    setExpandedPanel(expanded ? panel : undefined);
  };

  return (
    <Grid item container xs={12} spacing={5}>
      {faqs.map((faq, index) => (
        <Grid item xs={12} md={6} key={faq.question}>
          <Box>
            <Accordion expanded={expandedPanel === index} onChange={handleChange(index)}>
              <AccordionSummary expandIcon={<ExpandMore />}>
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
