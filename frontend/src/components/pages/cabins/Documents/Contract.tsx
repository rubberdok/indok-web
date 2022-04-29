import { useQuery } from "@apollo/client";
import { QUERY_BOOKING_RESPONSIBLE } from "@graphql/cabins/queries";
import { BookingResponsible, Cabin, ContactInfo, DatePick } from "@interfaces/cabins";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { convertDateFormat, toStringChosenCabins, calculatePrice } from "@utils/cabins";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ContractProps {
  chosenCabins: Cabin[];
  contactInfo: ContactInfo;
  datePick: DatePick;
}
/*
Renders the contract of a booking.
*/
const Contract: React.FC<ContractProps> = ({ chosenCabins, contactInfo, datePick }) => {
  const currentTime = new Date().toLocaleString();
  const price = calculatePrice(chosenCabins, contactInfo, datePick);

  const { data } = useQuery<{ activeBookingResponsible: BookingResponsible }>(QUERY_BOOKING_RESPONSIBLE);
  const [responsible, setResponsible] = useState<BookingResponsible>();

  useEffect(() => {
    if (data?.activeBookingResponsible) {
      setResponsible(data.activeBookingResponsible);
    }
  }, [data]);

  //NB! there also exist a HTML template version of the contract backend, in case of changes both must be updated
  return (
    <Grid container>
      <Box m={2}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Image alt="logo" src="/img/hyttestyret_logo.png" width={300} height={165} />
        </Box>
        <Typography variant="h2" align="center">
          Leiekontrakt
        </Typography>
        <Divider component="br" />
        <Typography variant="body2" component="span">
          På vegne av Foreningen for studenter ved Industriell Økonomi og Teknologiledelse er det i dag inngått følgende
          leiekontrakt mellom Hyttestyret og
          <Box display="inline" fontWeight="fontWeightBold">
            {` ${contactInfo.firstName} ${contactInfo.lastName}`}.
          </Box>
          <Divider component="br" />
        </Typography>
      </Box>

      <Box m={2}>
        <Typography variant="body2">
          Gjeldende Leieobjekt(er): <b>{toStringChosenCabins(chosenCabins)}</b>, Landsbygrenda, 7340 Oppdal
          <Divider component="br" />
          Leieperiode: <b>{datePick.checkInDate && convertDateFormat(datePick.checkInDate)}</b> -{" "}
          <b>{datePick.checkOutDate && convertDateFormat(datePick.checkOutDate)}</b>
          <Divider component="br" />
          Leiesum: <b>{price}</b> NOK innbetalt til konto <b>9235.28.31311</b> i forkant av leieperioden.
        </Typography>
        <Divider component="br" />
        <Typography variant="body2">
          Leietager betaler ikke depositum i forkant av leieperioden, men eventuelle skader på hytte eller inventar samt
          mangelfull vask før avreise faktureres leietager i etterkant av leieperioden. Fratrekkets størrelsesorden vil
          være gitt av rimeligste alternativ for reparasjon, nyinnkjøp eller vask.
        </Typography>
        <Typography variant="body2">
          Leieobjektet skal kun benyttes av leietagers forening, og fremleie av leieobjektet er således ikke tillatt.
          Som fremleie likestilles at enhver som ikke er i forbindelse med den eller de som har signert leieavtalen
          benytter leieobjektet. Under leieperioden skal kontraktsignatør til enhver tid ha kontroll på de besøkende, og
          sørge for at leieobjektet aldri blir forlatt ulåst. Bookingansvarlig forebeholder retten til å kreve
          klokkeslett for avgang på leieperiodens siste dag, men ikke tidligere enn 14:00.
        </Typography>
      </Box>

      <Box m={2}>
        <Typography variant="body2">Leietager plikter å</Typography>
        <ul>
          <li>
            <Typography variant="body2">
              behandle hytta og dens inventar med aktsomhet, og stilles erstatningspliktig til all skade som skyldes
              leietager selv eller medleietagere. Særskilt fører tap av hyttenøkkel til etterfakturering på NOK 1000,-
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              følge sjekkliste for utvask ut av hytta etter bruk. Utvask som ikke oppfyller kravene fører til
              etterfakturering på NOK 1600,-
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              følge de bruksregler som gjelder for hytta, og ved leieforholdets opphør se til at de øvrige forpliktelser
              i henhold til kontrakten er blitt holdt, se vedlagte sjekkliste.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              straks melde fra om skader eller mangler som må utbedres uten opphold, til utleier ved bookingansvarlig{" "}
              {responsible?.firstName} {responsible?.lastName} på telefon {responsible?.phone} eller e-post{" "}
              {responsible?.email}. Annen skade eller mangler meldes fra til utleier i sammenheng med tilbakelevering av
              nøkler ved endt leieperiode.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              lese grundig i gjennom hyttenes reglement som sendes på mail etter sendt søknad.
            </Typography>
          </li>
        </ul>
      </Box>

      <Box m={2}>
        <Typography variant="body2">Utleier plikter å</Typography>
        <ul>
          <li>
            <Typography variant="body2">sørge for at hytta er i forsvarlig stand ved leieforholdets start.</Typography>
          </li>
          <li>
            <Typography variant="body2">sørge for at alle forsikringer er i orden.</Typography>
          </li>
          <li>
            <Typography variant="body2">
              utbedre mangler og skader som ikke er utbedret av leietager, om berettiget, på leietakers regning.
            </Typography>
          </li>
        </ul>
      </Box>

      <Box m={2}>
        <Typography variant="body2">
          Partene vedtar eiendommens verneting i alle tvister som måtte oppstå i forbindelse med avtalen.
        </Typography>
        <Typography variant="body2">
          Hyttestyret forbeholder seg retten til å kunne gjøre om på bookingen hvis det skulle oppstå uforutsette
          hendelser.
        </Typography>
        <Typography variant="body2">
          Flytter ikke leietager når leieperioden er utløpt, kan vedkommende kastes ut uten søksmål og dom etter § 13-2
          i Tvangsfullbyrdelsesloven.{" "}
        </Typography>
        <Typography variant="body2">
          Denne leieavtalen er utstedt i 2 – to – eksemplarer, ett til hver av partene.
        </Typography>
        <Typography variant="body2">
          Dato/tid: <b>{currentTime}</b>
        </Typography>
      </Box>
    </Grid>
  );
};

export default Contract;
