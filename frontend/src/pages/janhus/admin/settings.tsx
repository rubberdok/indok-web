import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { Title } from "@/components/Title";
import {
  JanHusAreaConfigurationsDocument,
  JanHusBookingSettingsDocument,
  UpdateJanhusAreaConfigurationDocument,
  UpdateJanhusBookingSettingsDocument,
} from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

const DATE_FORMAT = "YYYY-MM-DD";

function formatDate(date: string) {
  return dayjs(date).tz("Europe/Oslo").format(DATE_FORMAT);
}

type SettingsForm = {
  minDurationMinutes: number;
  slotGranularityMinutes: number;
  openingHour: number;
  closingHour: number;
  bufferMinutes: number;
  organizationBookingOpensWeeksBefore: number;
  generalBookingOpensWeeksBefore: number;
  fallStartDate: string;
  fallEndDate: string;
  springStartDate: string;
  springEndDate: string;
  fallSemesterActive: boolean;
  springSemesterActive: boolean;
  externalBookingsEnabled: boolean;
};

const AREA_LABELS: Record<string, string> = {
  FIRST_FLOOR: "1. etasje",
  SECOND_FLOOR: "2. etasje",
  ENTIRE_HOUSE: "Hele huset",
};

const JanHusSettingsPage: NextPageWithLayout = () => {
  const [alert, setAlert] = useState<{ severity: "success" | "error"; message: string } | undefined>();

  const { data: settingsData, refetch: refetchSettings } = useQuery(JanHusBookingSettingsDocument);
  const { data: areaData, refetch: refetchAreas } = useQuery(JanHusAreaConfigurationsDocument);

  const [settingsForm, setSettingsForm] = useState<SettingsForm>({
    minDurationMinutes: 60,
    slotGranularityMinutes: 30,
    openingHour: 8,
    closingHour: 2,
    bufferMinutes: 0,
    organizationBookingOpensWeeksBefore: 6,
    generalBookingOpensWeeksBefore: 4,
    fallStartDate: formatDate(new Date().toISOString()),
    fallEndDate: formatDate(new Date().toISOString()),
    springStartDate: formatDate(new Date().toISOString()),
    springEndDate: formatDate(new Date().toISOString()),
    fallSemesterActive: true,
    springSemesterActive: true,
    externalBookingsEnabled: true,
  });

  const [areaForms, setAreaForms] = useState<
    Record<
      string,
      {
        internalPricePerHour: string;
        externalPricePerHour: string;
        cleaningFee: string;
        defaultDepositAmount: string;
      }
    >
  >({});

  const openingHourOptions = useMemo(() => {
    const slotGranularityMinutes = Math.max(settingsForm.slotGranularityMinutes, 1);
    const values: number[] = [];

    for (let minutes = 0; minutes < 24 * 60; minutes += slotGranularityMinutes) {
      if (minutes % 60 === 0) {
        values.push(minutes / 60);
      }
    }

    if (!values.includes(settingsForm.openingHour)) {
      values.push(settingsForm.openingHour);
    }

    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [settingsForm.openingHour, settingsForm.slotGranularityMinutes]);

  const closingHourOptions = useMemo(() => {
    const slotGranularityMinutes = Math.max(settingsForm.slotGranularityMinutes, 1);
    const options: Array<{ value: number; label: string }> = [];

    for (let offset = slotGranularityMinutes; offset <= 24 * 60; offset += slotGranularityMinutes) {
      const minutesFromMidnight = settingsForm.openingHour * 60 + offset;
      if (minutesFromMidnight % 60 !== 0) {
        continue;
      }

      const value = Math.floor(minutesFromMidnight / 60) % 24;
      const dayOffset = Math.floor(minutesFromMidnight / (24 * 60));
      const label = `${value.toString().padStart(2, "0")}:00${dayOffset > 0 ? " (+1 dag)" : ""}`;

      if (!options.some((option) => option.value === value)) {
        options.push({ value, label });
      }
    }

    if (!options.some((option) => option.value === settingsForm.closingHour)) {
      const wrapsToNextDay = settingsForm.closingHour <= settingsForm.openingHour;
      options.push({
        value: settingsForm.closingHour,
        label: `${settingsForm.closingHour.toString().padStart(2, "0")}:00${wrapsToNextDay ? " (+1 dag)" : ""}`,
      });
    }

    return options;
  }, [settingsForm.closingHour, settingsForm.openingHour, settingsForm.slotGranularityMinutes]);

  useEffect(() => {
    const settings = settingsData?.janhusBookingSettings;
    if (!settings) return;

    setSettingsForm({
      minDurationMinutes: settings.minDurationMinutes,
      slotGranularityMinutes: settings.slotGranularityMinutes,
      openingHour: settings.openingHour,
      closingHour: settings.closingHour,
      bufferMinutes: settings.bufferMinutes,
      organizationBookingOpensWeeksBefore: settings.organizationBookingOpensWeeksBefore,
      generalBookingOpensWeeksBefore: settings.generalBookingOpensWeeksBefore,
      fallStartDate: formatDate(settings.fallStartDate),
      fallEndDate: formatDate(settings.fallEndDate),
      springStartDate: formatDate(settings.springStartDate),
      springEndDate: formatDate(settings.springEndDate),
      fallSemesterActive: settings.fallSemesterActive,
      springSemesterActive: settings.springSemesterActive,
      externalBookingsEnabled: settings.externalBookingsEnabled ?? true,
    });
  }, [settingsData]);

  useEffect(() => {
    const configurations = areaData?.janhusAreaConfigurations;
    if (!configurations) return;

    setAreaForms(
      Object.fromEntries(
        configurations.map((configuration) => [
          configuration.area,
          {
            internalPricePerHour: String(configuration.internalPricePerHour),
            externalPricePerHour: String(configuration.externalPricePerHour),
            cleaningFee: String(configuration.cleaningFee),
            defaultDepositAmount: String(configuration.defaultDepositAmount ?? 0),
          },
        ])
      )
    );
  }, [areaData]);

  const [updateSettings, { loading: settingsSaving }] = useMutation(UpdateJanhusBookingSettingsDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Innstillinger oppdatert" });
      await refetchSettings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [updateArea, { loading: areaSaving }] = useMutation(UpdateJanhusAreaConfigurationDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Prisinnstillinger oppdatert" });
      await refetchAreas();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  async function saveSettings() {
    await updateSettings({
      variables: {
        settingsData: {
          minDurationMinutes: settingsForm.minDurationMinutes,
          slotGranularityMinutes: settingsForm.slotGranularityMinutes,
          openingHour: settingsForm.openingHour,
          closingHour: settingsForm.closingHour,
          bufferMinutes: settingsForm.bufferMinutes,
          organizationBookingOpensWeeksBefore: settingsForm.organizationBookingOpensWeeksBefore,
          generalBookingOpensWeeksBefore: settingsForm.generalBookingOpensWeeksBefore,
          fallStartDate: settingsForm.fallStartDate,
          fallEndDate: settingsForm.fallEndDate,
          springStartDate: settingsForm.springStartDate,
          springEndDate: settingsForm.springEndDate,
          fallSemesterActive: settingsForm.fallSemesterActive,
          springSemesterActive: settingsForm.springSemesterActive,
          externalBookingsEnabled: settingsForm.externalBookingsEnabled,
        },
      },
    });
  }

  async function saveArea(area: string) {
    const form = areaForms[area];
    if (!form) return;

    await updateArea({
      variables: {
        areaData: {
          area,
          internalPricePerHour: Number(form.internalPricePerHour),
          externalPricePerHour: Number(form.externalPricePerHour),
          cleaningFee: Number(form.cleaningFee),
          defaultDepositAmount: Number(form.defaultDepositAmount),
        },
      },
    });
  }

  return (
    <>
      <Title
        title="Innstillinger"
        overline="Bookinger"
        variant="dark"
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: "JanHus",
            href: "/janhus",
          },
          {
            name: "Adminside",
            href: "/janhus/admin",
          },
          {
            name: "Innstillinger",
            href: "/janhus/admin/settings",
          },
        ]}
      />

      <Container>
        <PermissionRequired permission="janhus.manage_settings">
          <Stack direction="column" spacing={4}>
            {alert ? <Alert severity={alert.severity}>{alert.message}</Alert> : null}

            <Paper sx={{ p: 3 }} elevation={0}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h4" component="h2">
                  Start- og sluttdato for høst- og vårsemester
                </Typography>
                <Typography>Det vil kun være mulig for brukere å søke om bookinger i disse periodene.</Typography>

                <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                  <Stack spacing={2}>
                    <Typography variant="h6">Høstsemester</Typography>
                    <TextField
                      label="Start"
                      type="date"
                      value={settingsForm.fallStartDate}
                      onChange={(event) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          fallStartDate: event.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Slutt"
                      type="date"
                      value={settingsForm.fallEndDate}
                      onChange={(event) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          fallEndDate: event.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settingsForm.fallSemesterActive}
                          onChange={(event) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              fallSemesterActive: event.target.checked,
                            }))
                          }
                        />
                      }
                      label="Åpent for bestillinger"
                    />
                  </Stack>

                  <Stack spacing={2}>
                    <Typography variant="h6">Vårsemester</Typography>
                    <TextField
                      label="Start"
                      type="date"
                      value={settingsForm.springStartDate}
                      onChange={(event) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          springStartDate: event.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Slutt"
                      type="date"
                      value={settingsForm.springEndDate}
                      onChange={(event) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          springEndDate: event.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settingsForm.springSemesterActive}
                          onChange={(event) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              springSemesterActive: event.target.checked,
                            }))
                          }
                        />
                      }
                      label="Åpent for bestillinger"
                    />
                  </Stack>
                </Box>

                <Box>
                  <Button variant="contained" onClick={saveSettings} disabled={settingsSaving}>
                    Lagre semestre og regler
                  </Button>
                </Box>
              </Stack>
            </Paper>

            <Divider />

            <Paper sx={{ p: 3 }} elevation={0}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h4" component="h2">
                  Bookingregler
                </Typography>
                <Typography>
                  Konfigurer varighet, granularitet og åpningstider som styrer hvilke tider som kan bookes i JanHus.
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }}>
                  <TextField
                    label="Minimum varighet (min)"
                    type="number"
                    value={settingsForm.minDurationMinutes}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({ ...prev, minDurationMinutes: Number(event.target.value) }))
                    }
                  />
                  <TextField
                    label="Granularitet (min)"
                    type="number"
                    value={settingsForm.slotGranularityMinutes}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({ ...prev, slotGranularityMinutes: Number(event.target.value) }))
                    }
                  />
                  <TextField
                    label="Buffer (min)"
                    type="number"
                    value={settingsForm.bufferMinutes}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({ ...prev, bufferMinutes: Number(event.target.value) }))
                    }
                  />
                  <FormControl>
                    <InputLabel>Åpningstime</InputLabel>
                    <Select
                      label="Åpningstime"
                      value={settingsForm.openingHour}
                      onChange={(event) =>
                        setSettingsForm((prev) => ({ ...prev, openingHour: Number(event.target.value) }))
                      }
                    >
                      {openingHourOptions.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value.toString().padStart(2, "0")}:00
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Stengetime</InputLabel>
                    <Select
                      label="Stengetime"
                      value={settingsForm.closingHour}
                      onChange={(event) =>
                        setSettingsForm((prev) => ({ ...prev, closingHour: Number(event.target.value) }))
                      }
                    >
                      {closingHourOptions.map((option) => (
                        <MenuItem key={`${option.value}-${option.label}`} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Organisasjoner åpner (uker før)"
                    type="number"
                    value={settingsForm.organizationBookingOpensWeeksBefore}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        organizationBookingOpensWeeksBefore: Number(event.target.value),
                      }))
                    }
                  />
                  <TextField
                    label="Personlige bookinger åpner (uker før)"
                    type="number"
                    value={settingsForm.generalBookingOpensWeeksBefore}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        generalBookingOpensWeeksBefore: Number(event.target.value),
                      }))
                    }
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settingsForm.externalBookingsEnabled}
                      onChange={(event) =>
                        setSettingsForm((prev) => ({ ...prev, externalBookingsEnabled: event.target.checked }))
                      }
                    />
                  }
                  label="Tillat eksterne bookingforespørsler"
                />

                <Box>
                  <Button variant="contained" onClick={saveSettings} disabled={settingsSaving}>
                    Lagre regler
                  </Button>
                </Box>
              </Stack>
            </Paper>

            <Divider />

            <Paper sx={{ p: 3 }} elevation={0}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h4" component="h2">
                  Pris per område
                </Typography>
                <Typography>Her kan dere oppdatere intern-/eksternpris og renholdsgebyr for hvert område.</Typography>

                <Stack spacing={2}>
                  {(areaData?.janhusAreaConfigurations ?? []).map((configuration) => {
                    const form = areaForms[configuration.area];
                    return (
                      <Box key={configuration.id} p={2} border={1} borderColor="divider" borderRadius={2}>
                        <Stack spacing={2}>
                          <Typography variant="h6">{AREA_LABELS[configuration.area] ?? configuration.area}</Typography>
                          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                              label="Internpris per time"
                              type="number"
                              value={form?.internalPricePerHour ?? ""}
                              onChange={(event) =>
                                setAreaForms((prev) => ({
                                  ...prev,
                                  [configuration.area]: {
                                    ...(prev[configuration.area] ?? {
                                      internalPricePerHour: "0",
                                      externalPricePerHour: "0",
                                      cleaningFee: "0",
                                      defaultDepositAmount: "0",
                                    }),
                                    internalPricePerHour: event.target.value,
                                  },
                                }))
                              }
                            />
                            <TextField
                              label="Eksternpris per time"
                              type="number"
                              value={form?.externalPricePerHour ?? ""}
                              onChange={(event) =>
                                setAreaForms((prev) => ({
                                  ...prev,
                                  [configuration.area]: {
                                    ...(prev[configuration.area] ?? {
                                      internalPricePerHour: "0",
                                      externalPricePerHour: "0",
                                      cleaningFee: "0",
                                      defaultDepositAmount: "0",
                                    }),
                                    externalPricePerHour: event.target.value,
                                  },
                                }))
                              }
                            />
                            {/* <TextField
                              label="Renholdsgebyr"
                              type="number"
                              value={form?.cleaningFee ?? ""}
                              onChange={(event) =>
                                setAreaForms((prev) => ({
                                  ...prev,
                                  [configuration.area]: {
                                    ...(prev[configuration.area] ?? {
                                      internalPricePerHour: "0",
                                      externalPricePerHour: "0",
                                      cleaningFee: "0",
                                      defaultDepositAmount: "0",
                                    }),
                                    cleaningFee: event.target.value,
                                  },
                                }))
                              }
                            /> */}
                            <TextField
                              label="Depositum"
                              type="number"
                              value={form?.defaultDepositAmount ?? ""}
                              onChange={(event) =>
                                setAreaForms((prev) => ({
                                  ...prev,
                                  [configuration.area]: {
                                    ...(prev[configuration.area] ?? {
                                      internalPricePerHour: "0",
                                      externalPricePerHour: "0",
                                      cleaningFee: "0",
                                      defaultDepositAmount: "0",
                                    }),
                                    defaultDepositAmount: event.target.value,
                                  },
                                }))
                              }
                            />
                          </Stack>
                          <Box>
                            <Button
                              variant="outlined"
                              onClick={() => saveArea(configuration.area)}
                              disabled={areaSaving}
                            >
                              Lagre priser
                            </Button>
                          </Box>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </PermissionRequired>
      </Container>
    </>
  );
};

JanHusSettingsPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanHusSettingsPage;
