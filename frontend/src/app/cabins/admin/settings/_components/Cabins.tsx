import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { UseFormRegister, UseFormStateReturn, useForm } from "react-hook-form";
import { z } from "zod";

import { useAlerts } from "@/app/components/Alerts";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { Currency } from "@/app/_components/Currency";

type CabinsProps = {
  query: FragmentType<typeof CabinsQueryFragment>;
};

const CabinsQueryFragment = graphql(`
  fragment AdminCabins_Query on Query {
    cabins {
      cabins {
        id
        ...Cabins_Cabin
      }
    }
  }
`);

const CabinFragment = graphql(`
  fragment Cabins_Cabin on Cabin {
    id
    name
    price {
      internal {
        weekend
        weekday
      }
      external {
        weekend
        weekday
      }
    }
    capacity
  }
`);

function Cabins(props: CabinsProps) {
  const data = getFragmentData(CabinsQueryFragment, props.query);
  const [creating, setCreating] = useState(false);
  const { notify } = useAlerts();
  const [createCabin, { loading }] = useMutation(
    graphql(`
      mutation Cabins_CreateCabin($data: CreateCabinInput!) {
        createCabin(data: $data) {
          cabin {
            ...Cabins_Cabin
          }
        }
      }
    `),
    {
      onCompleted({ createCabin }) {
        const cabin = getFragmentData(CabinFragment, createCabin.cabin);
        notify({ message: `${cabin.name} ble opprettet`, type: "success" });
        setCreating(false);
      },
      onError(error) {
        notify({ title: "Noe gikk galt", message: error.message, type: "error" });
      },
      update(cache, { data }) {
        if (data) {
          cache.modify({
            fields: {
              cabins(existingCabins = { cabins: [] }) {
                const newCabinRef = cache.writeFragment({
                  data: getFragmentData(CabinFragment, data.createCabin.cabin),
                  fragment: CabinFragment,
                });
                return {
                  cabins: [...existingCabins.cabins, newCabinRef],
                };
              },
            },
          });
        }
      },
    }
  );

  const { register, handleSubmit, formState } = useForm<CabinForm>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: CabinForm) {
    createCabin({
      variables: {
        data: {
          name: data.name,
          internalPrice: data.internalPrice,
          internalPriceWeekend: data.internalPriceWeekend,
          externalPrice: data.externalPrice,
          externalPriceWeekend: data.externalPriceWeekend,
          capacity: data.capacity,
        },
      },
    });
  }

  return (
    <>
      <Dialog open={creating} onClose={() => setCreating(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Opprett ny hytte</DialogTitle>
          <DialogContent>
            <CabinFormFields register={register} errors={formState.errors} />
          </DialogContent>
          <DialogActions>
            <LoadingButton color="secondary" loading={loading} onClick={() => setCreating(false)}>
              Avbryt
            </LoadingButton>
            <LoadingButton loading={loading} type="submit">
              Opprett
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
      <Card>
        <CardHeader title="Hytter" />
        <CardContent>
          <Stack direction="column" divider={<Divider />} spacing={4}>
            {data.cabins.cabins.map((cabin) => (
              <Cabin cabin={cabin} key={cabin.id} />
            ))}
            <Button onClick={() => setCreating(true)}>Legg til en ny hytte</Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

type CabinProps = {
  cabin: FragmentType<typeof CabinFragment>;
};

const schema = z.object({
  name: z.string(),
  internalPrice: z.coerce.number().min(0),
  internalPriceWeekend: z.coerce.number().min(0),
  externalPrice: z.coerce.number().min(0),
  externalPriceWeekend: z.coerce.number().min(0),
  capacity: z.coerce.number().min(0),
});

type CabinForm = z.infer<typeof schema>;

function Cabin(props: CabinProps) {
  const cabin = getFragmentData(CabinFragment, props.cabin);
  const [editing, setEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CabinForm>({
    defaultValues: {
      name: cabin.name,
      internalPrice: cabin.price.internal.weekday,
      internalPriceWeekend: cabin.price.internal.weekend,
      externalPrice: cabin.price.external.weekday,
      externalPriceWeekend: cabin.price.external.weekend,
      capacity: cabin.capacity,
    },
    resolver: zodResolver(schema),
  });

  const { notify } = useAlerts();

  const [updateCabin, { loading }] = useMutation(
    graphql(`
      mutation Cabin_UpdateCabin($data: UpdateCabinInput!) {
        updateCabin(data: $data) {
          cabin {
            ...Cabins_Cabin
          }
        }
      }
    `),
    {
      onCompleted({ updateCabin }) {
        const cabin = getFragmentData(CabinFragment, updateCabin.cabin);
        notify({ message: `${cabin.name} ble oppdatert`, type: "success" });
        setEditing(false);
      },
      onError(error) {
        notify({ title: "Noe gikk galt", message: error.message, type: "error" });
      },
    }
  );

  function onSubmit(data: CabinForm) {
    updateCabin({
      variables: {
        data: {
          id: cabin.id,
          name: data.name,
          internalPrice: data.internalPrice,
          internalPriceWeekend: data.internalPriceWeekend,
          externalPrice: data.externalPrice,
          externalPriceWeekend: data.externalPriceWeekend,
          capacity: data.capacity,
        },
      },
    });
  }

  return (
    <>
      <Dialog open={editing} onClose={() => setEditing(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Rediger hytte</DialogTitle>
          <DialogContent>
            <CabinFormFields register={register} errors={errors} />
          </DialogContent>
          <DialogActions>
            <LoadingButton loading={loading} onClick={() => setEditing(false)}>
              Avbryt
            </LoadingButton>
            <LoadingButton loading={loading} type="submit">
              Lagre
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
      <Stack direction="column" key={cabin.id} spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column">
            <Typography variant="subtitle2" gutterBottom>
              {cabin.name}
            </Typography>
            <Typography variant="caption">{cabin.capacity} sengeplasser</Typography>
          </Stack>
          <Box>
            <IconButton onClick={() => setEditing(true)}>
              <Edit />
            </IconButton>
          </Box>
        </Stack>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Priser
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">Ukedag</TableCell>
                <TableCell align="right">Helg</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Intern</TableCell>
                <TableCell align="right">
                  <Currency amount={cabin.price.internal.weekday} />
                </TableCell>
                <TableCell align="right">
                  <Currency amount={cabin.price.internal.weekend} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ekstern</TableCell>
                <TableCell align="right">
                  <Currency amount={cabin.price.external.weekday} />
                </TableCell>
                <TableCell align="right">
                  <Currency amount={cabin.price.external.weekend} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </>
  );
}

function CabinFormFields({
  register,
  errors,
}: {
  register: UseFormRegister<CabinForm>;
  errors: UseFormStateReturn<CabinForm>["errors"];
}) {
  return (
    <Stack direction="column" spacing={1} pt={1}>
      <Stack direction="row" spacing={1}>
        <TextField
          {...register("name")}
          label="Navn"
          required
          error={Boolean(errors.name)}
          helperText={errors.name?.message ?? " "}
        />
        <TextField
          {...register("capacity")}
          label="Kapasitet"
          required
          type="number"
          error={Boolean(errors.capacity)}
          helperText={errors.capacity?.message ?? " "}
        />
      </Stack>

      <Stack direction="row" spacing={1}>
        <TextField
          {...register("internalPrice")}
          label="Internpris (ukedag)"
          required
          type="number"
          error={Boolean(errors.internalPrice)}
          helperText={errors.internalPrice?.message ?? " "}
        />

        <TextField
          {...register("internalPriceWeekend")}
          label="Internpris (helg)"
          required
          type="number"
          error={Boolean(errors.internalPriceWeekend)}
          helperText={errors.internalPriceWeekend?.message ?? " "}
        />
      </Stack>

      <Stack direction="row" spacing={1}>
        <TextField
          {...register("externalPrice")}
          label="Eksternpris (ukedag)"
          required
          type="number"
          error={Boolean(errors.externalPrice)}
          helperText={errors.externalPrice?.message ?? " "}
        />
        <TextField
          {...register("externalPriceWeekend")}
          label="Eksternpris (helg)"
          required
          type="number"
          error={Boolean(errors.externalPriceWeekend)}
          helperText={errors.externalPriceWeekend?.message ?? " "}
        />
      </Stack>
    </Stack>
  );
}

export { Cabins };
