import { Cabin, ContactInfo } from "@interfaces/cabins";
import {
  Box,
  createStyles,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { toStringChosenCabins } from "@utils/cabins";
import { calculatePrice } from "@utils/cabins";
import React from "react";
import { DatePick } from "src/pages/cabins/book";

const useStyles = makeStyles(() =>
  createStyles({
    logo: {
      margin: "auto",
      width: "30vh",
    },
  })
);

interface ContractProps {
  chosenCabins: Cabin[];
  contactInfo: ContactInfo;
  datePick: DatePick;
}

const Contract = ({ chosenCabins, contactInfo, datePick }: ContractProps) => {
  const currentTime = new Date().toLocaleString();
  const classes = useStyles();
  const price = calculatePrice(chosenCabins, contactInfo, datePick);

  return (
    <>
      <Grid container>
        <Box m={2}>
          <img alt="logo" src="/img/hyttestyret_logo.png" className={classes.logo} />
          <Typography variant="h2" align="center">
            Leiekontrakt
          </Typography>
          <Divider component="br" />
          <Typography variant="body1" component="span">
            På vegne av Foreningen for studenter ved Industriell økonomi og teknologiledelse er det i dag inngått
            følgende leiekontrakt mellom Hyttestyret og
            <Box display="inline" fontWeight="fontWeightBold">
              {` ${contactInfo.firstName} ${contactInfo.lastName}`}
            </Box>
            <Divider component="br" />
          </Typography>
        </Box>

        <Box m={2}>
          <Typography variant="body1">
            Gjeldende Leieobjekt(er): <b>{toStringChosenCabins(chosenCabins)}</b>, Landsbygrenda, 7340 Oppdal
            <Divider component="br" />
            Leieperiode: <b>{datePick.checkInDate}</b> - <b>{datePick.checkOutDate}</b> (yyyy-mm-dd)
            <Divider component="br" />
            Leiesum: <b>{price}</b> NOK innbetalt til konto 9235.28.31311 i forkant av leieperioden.
          </Typography>
          <Typography variant="body1">
            Leietager betaler ikke depositum i forkant av leieperioden, men eventuelle skader på hytte eller inventar
            samt mangelfull vask før avreise faktureres leietager i etterkant av leieperioden. Fratrekkets
            størrelsesorden vil være gitt av rimeligste alternativ for reparasjon, nyinnkjøp eller vask.
          </Typography>
          <Typography variant="body1">
            Leieobjektet skal kun benyttes av leietagers forening, og fremleie av leieobjektet er således ikke tillatt.
            Som fremleie likestilles at enhver som ikke er i forbindelse med den eller de som har signert leieavtalen
            benytter leieobjektet. Under leieperioden skal kontraktsignatør til enhver tid ha kontroll på de besøkende,
            og sørge for at leieobjektet aldri blir forlatt ulåst. Bookingansvarlig forebeholder retten til å kreve
            klokkeslett for avgang på leieperiodens siste dag, men ikke tidligere enn 14:00.
          </Typography>
        </Box>

        <Box m={2}>
          <Typography variant="body1">Leietager plikter å</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>
                behandle hytta og dens inventar med aktsomhet, og stilles erstatningspliktig til all skade som skyldes
                ham selv eller medleietagere. Særskilt fører tap av hyttenøkkel til etterfakturering på NOK 1000,-
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>
                følge sjekkliste for utvask ut av hytta etter bruk. Utvask som ikke oppfyller kravene fører til
                etterfakturering på NOK 1600,-
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>
                følge de bruksregler som gjelder for hytta, og ved leieforholdets opphør se til at de øvrige
                forpliktelser i henhold til kontrakten er blitt holdt, se vedlagte sjekkliste.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>
                straks melde fra om skader eller mangler som må utbedres uten opphold, til utleier ved bookingansvarlig
                Ellie Berglund på telefon 943 58 380. Annen skade eller mangler meldes fra til utleier i sammenheng med
                tilbakelevering av nøkler ved endt leieperiode.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>
                lese grundig i gjennom hyttenes reglement som ligger tilgjengelig på indokhyttene.no.
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box m={2}>
          <Typography variant="body1">Utleier plikter å</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>sørge for at hytta er i forsvarlig stand ved leieforholdets start.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>sørge for at alle forsikringer er i orden.</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>
                utbedre mangler og skader som ikke er utbedret av leietager, om berettiget, på leietakers regning.
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box m={2}>
          <Typography variant="body1">
            Partene vedtar eiendommens verneting i alle tvister som måtte oppstå i forbindelse med avtalen.
          </Typography>
          <Typography variant="body1">
            Hyttestyret forbeholder seg retten til å kunne gjøre om på bookingen hvis det skulle oppstå uforutsette
            hendelser.
          </Typography>
          <Typography variant="body1">
            Flytter ikke leietager når leieperioden er utløpt, kan vedkommende kastes ut uten søksmål og dom etter §
            13-2 i Tvangsfullbyrdelsesloven.{" "}
          </Typography>
          <Typography variant="body1">
            Denne leieavtalen er utstedt i 2 – to – eksemplarer, ett til hver av partene.
          </Typography>
          <Typography variant="body1">
            Dato/tid: <b>{currentTime}</b>
          </Typography>
        </Box>
      </Grid>
    </>
  );
};

export default Contract;
