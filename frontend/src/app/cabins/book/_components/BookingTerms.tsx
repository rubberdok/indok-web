import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { Link } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import dayjs from "@/lib/date";
import * as yup from "@/lib/validation";
import Error from "next/error";

type Props = {
  onSubmit: () => void;
  onPrevious: () => void;
  query: FragmentType<typeof BookingTermsQueryFragment>;
};

const BookingTermsQueryFragment = graphql(`
  fragment BookingTerms_Query on Query {
    bookingTerms {
      bookingTerms {
        id
        file {
          id
          url
        }
        createdAt
      }
    }
    bookingContact {
      bookingContact {
        id
        name
        email
        phoneNumber
      }
    }
  }
`);

/** Renders the contract of a booking. */
export const Contract: React.FC<Props> = ({ onSubmit, onPrevious, query }) => {
  const data = getFragmentData(BookingTermsQueryFragment, query);
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

  if (!data.bookingTerms.bookingTerms?.file.url)
    return <Error statusCode={404} title="Avtalevilkårene er ikke tilgjengelig" />;

  return (
    <Container maxWidth="sm" disableGutters>
      <Card>
        <CardHeader
          title="Leieavtale og bestillingsvilkår"
          subheader={`Sist oppdatert ${dayjs(data.bookingTerms.bookingTerms.createdAt).format("LLL")}`}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Typography>
              Eventuelle skader eller mangler meldes til {data.bookingContact.bookingContact.name} på telefon{" "}
              <Link href={`tel:${data.bookingContact.bookingContact.phoneNumber}`}>
                {data.bookingContact.bookingContact.phoneNumber}
              </Link>{" "}
              eller e-post{" "}
              <Link href={`mailto:${data.bookingContact.bookingContact.email}`}>
                {data.bookingContact.bookingContact.email}
              </Link>
              .
            </Typography>
            <Stack direction="row" justifyContent="flex-end">
              <FormControl error={Boolean(errors.approved)}>
                <FormControlLabel
                  required
                  label={
                    <Typography variant="body1">
                      Jeg har lest og godtar{" "}
                      <Link download target="_blank" href={data.bookingTerms.bookingTerms.file.url}>
                        leieavtalen
                      </Link>
                    </Typography>
                  }
                  labelPlacement="start"
                  control={<Checkbox {...register("approved")} />}
                />
                <FormHelperText error={Boolean(errors.approved)}>{errors.approved?.message ?? " "}</FormHelperText>
              </FormControl>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button onClick={() => onPrevious()} startIcon={<KeyboardArrowLeft />}>
              Tilbake
            </Button>
            <Button type="submit" endIcon={<KeyboardArrowRight />}>
              Neste
            </Button>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
};
