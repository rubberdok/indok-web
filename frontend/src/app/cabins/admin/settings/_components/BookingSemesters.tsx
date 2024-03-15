import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAlerts } from "@/app/components/Alerts";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import dayjs from "@/lib/date";

const BookingSemesterFragment = graphql(`
  fragment BookingSemester_BookingSemester on BookingSemester {
    id
    startAt
    endAt
    bookingsEnabled
    semester
  }
`);

const BookingSemestersQueryFragment = graphql(`
  fragment BookingSemesters_Query on Query {
    bookingSemesters {
      spring {
        ...BookingSemester_BookingSemester
      }
      fall {
        ...BookingSemester_BookingSemester
      }
    }
  }
`);

type Props = {
  query: FragmentType<typeof BookingSemestersQueryFragment>;
};

function BookingSemesters(props: Props) {
  const data = getFragmentData(BookingSemestersQueryFragment, props.query);
  const spring = getFragmentData(BookingSemesterFragment, data.bookingSemesters.spring);
  const fall = getFragmentData(BookingSemesterFragment, data.bookingSemesters.fall);

  const { notify } = useAlerts();
  const [updateBookingSemester, { loading }] = useMutation(
    graphql(`
      mutation CabinsAdminSettingsPage_UpdateBookingSemesterMutation($data: UpdateBookingSemesterInput!) {
        updateBookingSemester(data: $data) {
          bookingSemester {
            ...BookingSemester_BookingSemester
          }
        }
      }
    `),
    {
      onCompleted() {
        notify({ message: "Bookingsemester oppdatert", type: "success" });
      },
    }
  );

  return (
    <Card>
      <CardHeader title="Bookingsemester" />
      <CardContent>
        <TableContainer>
          <Table size="small" sx={{ textWrap: "nowrap" }}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Semester</TableCell>
                <TableCell align="right">Starter</TableCell>
                <TableCell align="right">Slutter</TableCell>
                <TableCell align="center">Bestillinger tilgjengelig</TableCell>
                <TableCell align="center">Rediger</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <>
                {spring && (
                  <TableRow>
                    <TableCell align="left">Vår</TableCell>
                    <TableCell align="right">{dayjs(spring.startAt).format("LL")}</TableCell>
                    <TableCell align="right">{dayjs(spring.endAt).format("LL")}</TableCell>
                    <TableCell align="center">
                      <FormControlLabel
                        checked={spring.bookingsEnabled}
                        onChange={(_e, checked) => {
                          updateBookingSemester({
                            variables: {
                              data: {
                                semester: spring.semester,
                                bookingsEnabled: checked,
                                endAt: null,
                                startAt: null,
                              },
                            },
                          });
                        }}
                        control={<Switch />}
                        label={spring.bookingsEnabled ? "På" : "Av"}
                        labelPlacement="start"
                      />
                    </TableCell>
                    <EditBookingSemesterCell
                      bookingSemester={spring}
                      loading={loading}
                      onSubmit={(data) => {
                        updateBookingSemester({
                          variables: {
                            data: {
                              semester: spring.semester,
                              endAt: new Date(data.endAt).toISOString(),
                              startAt: new Date(data.startAt).toISOString(),
                            },
                          },
                        });
                      }}
                    />
                  </TableRow>
                )}
                {fall && (
                  <TableRow>
                    <TableCell align="left">Høst</TableCell>
                    <TableCell align="right">{dayjs(fall.startAt).format("LL")}</TableCell>
                    <TableCell align="right">{dayjs(fall.endAt).format("LL")}</TableCell>
                    <TableCell align="center">
                      <FormControlLabel
                        checked={fall.bookingsEnabled}
                        onChange={(_e, checked) => {
                          updateBookingSemester({
                            variables: {
                              data: {
                                semester: fall.semester,
                                bookingsEnabled: checked,
                                endAt: null,
                                startAt: null,
                              },
                            },
                          });
                        }}
                        control={<Switch />}
                        label={fall.bookingsEnabled ? "På" : "Av"}
                        labelPlacement="start"
                      />
                    </TableCell>
                    <EditBookingSemesterCell
                      bookingSemester={fall}
                      loading={loading}
                      onSubmit={(data) => {
                        updateBookingSemester({
                          variables: {
                            data: {
                              semester: fall.semester,
                              endAt: new Date(data.endAt).toISOString(),
                              startAt: new Date(data.startAt).toISOString(),
                            },
                          },
                        });
                      }}
                    />
                  </TableRow>
                )}
                {!spring && (
                  <TableRow>
                    <TableCell>Vår</TableCell>
                    <TableCell>Ikke satt</TableCell>
                    <TableCell>Ikke satt</TableCell>
                    <TableCell>
                      <FormControlLabel control={<Switch />} disabled label="Av" labelPlacement="start" />
                    </TableCell>
                  </TableRow>
                )}
                {!fall && (
                  <TableRow>
                    <TableCell>Høst</TableCell>
                    <TableCell>Ikke satt</TableCell>
                    <TableCell>Ikke satt</TableCell>
                    <TableCell>
                      <FormControlLabel control={<Switch />} disabled label="Av" labelPlacement="start" />
                    </TableCell>
                  </TableRow>
                )}
              </>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

type EditBookingSemesterCellProps = {
  bookingSemester: { startAt: string; endAt: string };
  onSubmit: (data: BookingSemesterForm) => void;
  loading?: boolean;
};

type BookingSemesterForm = {
  startAt: string;
  endAt: string;
};

const bookingSemesterSchema = z
  .object({
    startAt: z.coerce.date().transform((date) => dayjs(date).format("YYYY-MM-DD")),
    endAt: z.coerce.date().transform((date) => dayjs(date).format("YYYY-MM-DD")),
  })
  .refine(
    ({ startAt, endAt }) => {
      return startAt < endAt;
    },
    {
      message: "Startdato må være før sluttdato",
      path: ["startAt"],
    }
  );

function EditBookingSemesterCell({ loading, bookingSemester, ...props }: EditBookingSemesterCellProps) {
  const [editing, setEditing] = useState(false);

  function onSubmit(data: BookingSemesterForm) {
    props.onSubmit(data);
    setEditing(false);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingSemesterForm>({
    defaultValues: {
      startAt: dayjs(bookingSemester.startAt).format("YYYY-MM-DD"),
      endAt: dayjs(bookingSemester.endAt).format("YYYY-MM-DD"),
    },
    resolver: zodResolver(bookingSemesterSchema),
  });

  return (
    <>
      <Dialog open={editing} onClose={() => setEditing(false)}>
        <DialogTitle>Rediger bookingsemester</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack direction="row" spacing={1} pt={1} alignItems="center">
              <TextField
                {...register("startAt")}
                type="date"
                label="Fra"
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.startAt)}
                helperText={errors.startAt?.message ?? " "}
              />
              <div>
                <Typography>-</Typography>
                <FormHelperText> </FormHelperText>
              </div>
              <TextField
                {...register("endAt")}
                type="date"
                label="Til"
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.endAt)}
                helperText={errors.endAt?.message ?? " "}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <LoadingButton loading={loading} color="secondary" onClick={() => setEditing(false)}>
              Avbryt
            </LoadingButton>
            <LoadingButton loading={loading} type="submit">
              Lagre
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
      <TableCell align="center">
        <IconButton onClick={() => setEditing(true)}>
          <Edit />
        </IconButton>
      </TableCell>
    </>
  );
}

export { BookingSemesters };
