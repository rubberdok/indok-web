import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";

import dayjs from "@/lib/date";
import * as yup from "@/lib/validation";
import hytteforeningen from "~/public/static/cabins/logo.svg";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { BookingDetailsFields } from "./BookingDetails";

type Props = {
  selectedCabins: { id: string; name: string }[];
  bookingDetails: BookingDetailsFields | undefined;
  dates: {
    start: Date | undefined;
    end: Date | undefined;
  };
  onSubmit: () => void;
  onPrevious: () => void;
  price: number;
  query: FragmentType<typeof ContractQueryFragment>;
};

const ContractQueryFragment = graphql(`
  fragment Contract_Query on Query {
    bookingContact {
      bookingContact {
        name
        email
        phoneNumber
        id
      }
    }
  }
`);

/** Renders the contract of a booking. */
export const Contract: React.FC<Props> = ({
  selectedCabins,
  bookingDetails,
  dates,
  onSubmit,
  price,
  onPrevious,
  query,
}) => {
  const data = getFragmentData(ContractQueryFragment, query);
  const currentTime = dayjs().format("L");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ approved: boolean }>({
    resolver: yupResolver(
      yup.object({
        approved: yup.boolean().required("Du må godkjenne leieavtalen").isTrue("Du må godkjenne leieavtalen"),
      })
    ),
    defaultValues: {
      approved: false,
    },
  });

  const responsible = data.bookingContact.bookingContact;
  //NB! there also exist a HTML template version of the contract backend, in case of changes both must be updated
  return (
    <Container maxWidth="md" disableGutters>
      <Box m={2}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Image alt="Hytteforeningen" src={hytteforeningen} width={300} height={165} />
        </Box>
        <Typography variant="h2" align="center">
          Leiekontrakt
        </Typography>
        <Divider component="br" />
        <Typography variant="body2" component="span">
          På vegne av Foreningen for studenter ved Industriell Økonomi og Teknologiledelse er det i dag inngått følgende
          leiekontrakt mellom Hytteforeningen og
          <Box display="inline" fontWeight="fontWeightBold">
            {` ${bookingDetails?.firstName} ${bookingDetails?.lastName}`}.
          </Box>
          <Divider component="br" />
        </Typography>
      </Box>

      <Box m={2}>
        <Typography variant="body2">
          Gjeldende Leieobjekt(er): <b>{selectedCabins.map((cabin) => cabin.name).join(" og ")}</b>, Gardåvegen 88/90,
          7340 Oppdal
          <Divider component="br" />
          Leieperiode: <b>{dayjs(dates.start).format("L")}</b> - <b>{dayjs(dates.end).format("L")}</b>
          <Divider component="br" />
          Leiesum: <b>{price}</b> NOK faktureres i forkant av leieperioden.
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
              {responsible?.name} på telefon {responsible?.phoneNumber} eller e-post {responsible?.email}. Annen skade
              eller mangler meldes fra til utleier..
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
          Hytteforeningen forbeholder seg retten til å kunne gjøre om på bookingen hvis det skulle oppstå uforutsette
          hendelser.
        </Typography>
        <Typography variant="body2">
          Flytter ikke leietager når leieperioden er utløpt, kan vedkommende kastes ut uten søksmål og dom etter § 13-2
          i Tvangsfullbyrdelsesloven.{" "}
        </Typography>
        <Typography variant="body2">
          Denne leieavtalen er utstedt i 2 - to - eksemplarer, ett til hver av partene.
        </Typography>
        <Typography variant="body2">
          Dato/tid: <b>{currentTime}</b>
        </Typography>
      </Box>

      <Divider />
      <Stack direction="column" alignItems="flex-end" spacing={4} width="100%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl error={Boolean(errors.approved)}>
            <FormControlLabel
              required
              label="Jeg har lest og godtar leieavtalen"
              labelPlacement="start"
              control={<Checkbox {...register("approved")} />}
            />
            <FormHelperText error={Boolean(errors.approved)}>{errors.approved?.message ?? " "}</FormHelperText>
          </FormControl>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={() => onPrevious()} startIcon={<KeyboardArrowLeft />}>
              Tilbake
            </Button>
            <Button type="submit" endIcon={<KeyboardArrowRight />}>
              Neste
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
