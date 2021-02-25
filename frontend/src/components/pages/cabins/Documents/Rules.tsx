import { Box, Container, createStyles, Divider, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import HeaderComposition from "../HeaderComposition";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    logo: {
      margin: "auto",
      width: "30vh",
    },
    ruleHeader: {
      color: "#f40082",
    },
  })
);

const Rules: React.FC = () => {
  const handleBackButtonClick = () => window.close();
  const classes = useStyles();

  return (
    <>
      <Container>
        <img alt="logo" src="/static/cabins/hyttestyret_logo.png" className={classes.logo}></img>
        <HeaderComposition headerText="Retningslinjer for booking av hytte" arrowOnClick={handleBackButtonClick} />

        <Box m={3}>
          <Typography variant="h3" className={classes.ruleHeader}>
            Nøkkelansvarlig
          </Typography>

          <Typography variant="body1">
            §1.1 Nøkkelansvarlig er den som henter og leverer tilbake nøklene fra bookingansvarlig.
          </Typography>

          <Typography variant="body1">
            §1.2 Nøkkelansvarlig har ansvar for og er pliktig til å gi tilbakemelding om eventuelle skader, mangler,
            naboklager, ikke tilfredsstillende utvask, reglementsbrudd og andre problemer som har oppstått under
            oppholdet.
          </Typography>

          <Typography variant="body1">
            §1.3 Nøkkelansvarlig har ansvar for at alle ytterdører og vinduer er lukket og låst ved avreise samt å holde
            en forsvarlig innetemperatur både under eget opphold og etter avreise, se sjekkliste.
          </Typography>

          <Typography variant="body1">
            §1.4 Nøkkelansvarlig har rett til å sette tema og bestemme hva hyttene skal brukes til under oppholdet.
          </Typography>
        </Box>

        <Divider />

        <Box m={3}>
          <Typography variant="h3" className={classes.ruleHeader}>
            Bruksområde
          </Typography>

          <Typography variant="body1">
            §2.1 Hyttene skal disponeres til aktiviteter som innenfor rammene satt av nøkkelansvarlig. I hvor stor grad
            det eksempelvis kan festes, og til hvilken tid det forventes ro, avhenger av i hvilken grad nøkkelansvarlig
            har åpnet for slike aktiviteter. Sjekk med bookingsansvarlig, eller i kalenderen nederst på nettsiden,
            hvilket tema som er satt for det aktuelle tidsrommet før påmelding og avreise, og respekter dette.
          </Typography>
        </Box>

        <Divider />

        <Box m={3}>
          <Typography variant="h3" className={classes.ruleHeader}>
            Reservasjon av enkeltplasser
          </Typography>

          <Typography variant="body1">
            §3.1 Hyttestyret vil sanksjonere strengt mot ikke-registrert bruk av hyttene; både eget, og ved medbrakte
            venner.
          </Typography>

          <Typography variant="body1">§3.2 Alle gjester må være registrert av bookingansvarlig.</Typography>
        </Box>

        <Divider />

        <Box m={3}>
          <Typography variant="h3" className={classes.ruleHeader}>
            Eksterne gjester
          </Typography>

          <Typography variant="body1">
            §4.1 Den som reserverer gjestenes plasser har ansvar for deres handlinger.
          </Typography>

          <Typography variant="body1">
            §4.2 Eksterne gjester er underlagt samme reglement som indøkere. Den som har ansvar for deres
            tilstedeværelse har også ansvar for at de er inneforstått med gjeldende reglement.
          </Typography>

          <Typography variant="body1">
            §4.3 Eventuelle sanksjoner mot gjestene blir rettet mot personen selv og/eller mot indøkeren som reserverte
            dens plass. Hyttestyret vil avgjøre saksgangen ved slike tilfeller, se §9.
          </Typography>
        </Box>

        <Divider />

        <Box m={3}>
          <Typography variant="h3" className={classes.ruleHeader}>
            Utvask
          </Typography>

          <Typography variant="body1">
            §5.1 Hyttene skal ved avreise være i like god eller bedre stand enn ved ankomst.
          </Typography>

          <Typography variant="body1">
            §5.2 Utvask og avreiserutiner skal utføres i henhold til sjekkliste, se oppslag. Nøkkelansvarlig har ansvar
            for at dette blir etterfulgt.
          </Typography>

          <Typography variant="body1">
            §5.3 Gjestene kan eventuelt komme til enighet om å leie inn vaskefirmaet 2rve Rengjøring AS via Hyttestyret.
            Dette må avtales med Hyttestyret minimum to dager før avreise, og dere vil i etterkant motta faktureringen
            på NOK 1200 eks. mva. per hytte.
          </Typography>

          <Typography variant="body1">
            §5.4 Hyttene vil sjekkes av en representant fra 2rve Rengjøring etter hvert hyttebesøk. Ved mangelfull
            utvask vil gjestene faktureres for rengjøringskostnader i samme størrelsesorden som i §5.3.
          </Typography>

          <Typography variant="body1">§5.5 Utsjekk senest kl. 14, med mindre annet er avtalt.</Typography>

          <Typography variant="body1">§5.6 Innsjekk tidligst kl. 15, med mindre annet er avtalt.</Typography>
        </Box>

        <Divider />

        <Box m={3}>
          <Typography variant="h3" className={classes.ruleHeader}>
            Etikette
          </Typography>

          <Typography variant="body1">
            <b>HYTTENE SKAL DISPONERES FORNUFTIG OG ETTER FØLGENDE ETISKE RETNINGSLINJER:</b>
          </Typography>

          <Typography variant="body1">
            §6.1 Alle har meldeplikt overfor nøkkelansvarlig og erstatningsansvar for eventuelle skader de selv
            forårsaker.
          </Typography>

          <Typography variant="body1">
            §6.2 Vis hensyn til de andre hyttegjestene. Utover rammene for bruksområde, se §2, gjelder normal
            folkeskikk.
          </Typography>

          <Typography variant="body1">
            §6.3 Ta hensyn til nabohyttene, ta eventuelle naboklager til følge umiddelbart.
          </Typography>

          <Typography variant="body1">
            §6.4 Vis fornuftig strømforbruk slik at driftskostnadene, og dermed leieprisene, forholder seg lave. Skru av
            lys i rom som ikke er i bruk, påse at panelovner er satt til 13 ᵒC, og slå av badstuen når den ikke er i
            bruk.
          </Typography>

          <Typography variant="body1">
            §6.5 Tyveri av inventar og bruksmidler er strengt ulovlig og vil bli slått hardt ned på.
          </Typography>

          <Typography variant="body1">
            §6.6 Husk at dette er Indøks hytter, og med det dine egne hytter. Problemer skapt går også ut over deg selv.
            Føl deg som hjemme, og behandle hyttene som om det skulle vært ditt eget hjem.
          </Typography>

          <Typography variant="body1">§6.7 Røyking er forbudt innendørs på hyttene.</Typography>
        </Box>

        <Divider />

        <Box m={3}>
          <Typography variant="h3" className={classes.ruleHeader}>
            Sanksjoner
          </Typography>

          <Typography variant="body1">
            §7.1 Ved ødeleggelse eller brudd på reglementet har Hyttestyret full sanksjonsrett.
          </Typography>

          <Typography variant="body1">
            §7.2 Ved tap av nøkkel faktureres nøkkelansvarlig et gebyr direkte. Hvorvidt resterende gjester skal bidra
            til å dekke gebyret eller ikke, tar ikke Hyttestyret stilling til. Ved tap av hyttenøkkel faktureres NOK
            1000.
          </Typography>

          <Typography variant="body1">
            §7.3 Ved skade på hytte eller inventar faktureres de ansvarlig tilsvarende reparasjons- eller
            innkjøpskostnad.
          </Typography>

          <Typography variant="body1">
            §7.4 Ved mangelfull utvask vil nøkkelansvarlig faktureres et gebyr direkte. Hvorvidt resterende gjester skal
            bidra til å dekke gebyret eller ikke, tar ikke Hyttestyret stilling til. Se § 5.
          </Typography>

          <Typography variant="body1">
            §7.5 Andre brudd på reglementet kan medføre nedprioritering av senere reservasjoner eller periodevis
            utestengelse fra hyttene.
          </Typography>
        </Box>

        <Divider />

        <Box m={3}>
          <Typography variant="body1">
            Dersom dere skulle ha noen spørsmål ut over den informasjonen som er gitt i kontrakten og sjekklisten, og
            dersom det skulle være skader eller mangler som omgående bør sees til, kontakt oss.
          </Typography>

          <Typography variant="body1">
            <b>Leder Philip Kolkmeier - 906 71 650</b>
          </Typography>
          <Typography variant="body1">
            <b>Bookingansvarlig Ellie Berglund - 942 48 380</b>
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Rules;
