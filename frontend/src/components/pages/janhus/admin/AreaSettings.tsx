import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import type { AreaForm } from "@/components/pages/janhus/constants";

type Props = {
  areas: readonly { id: string; name: string; isActive: boolean }[];
  saveArea: (id: string) => void;
  handleArchiveArea: (id: string) => void;
  handleRestoreArea: (id: string) => void;
  areaForms: Record<string, AreaForm>;
  setAreaForms: Dispatch<SetStateAction<Record<string, AreaForm>>>;
  areaSaving: boolean;
};

export const AreaSettings: React.FC<Props> = ({
  areas,
  saveArea,
  handleArchiveArea,
  handleRestoreArea,
  areaForms,
  setAreaForms,
  areaSaving,
}) => {
  const activeAreas = areas.filter((area) => area.isActive);
  const archivedAreas = areas.filter((area) => !area.isActive);

  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h4" component="h2">
          Områder og priser
        </Typography>
        <Typography>
          Oppdater intern-/eksternpris og depositum for hvert område. Nye områder kan opprettes av Rubberdøk.
        </Typography>

        <Stack spacing={2}>
          {activeAreas.map((configuration) => {
            const form = areaForms[configuration.id];
            return (
              <Box key={configuration.id} p={2} border={1} borderColor="divider" borderRadius={2}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{configuration.name}</Typography>
                    <Button color="error" size="small" onClick={() => handleArchiveArea(configuration.id)}>
                      Arkiver
                    </Button>
                  </Stack>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      label="Internpris per time"
                      type="number"
                      value={form?.internalPricePerHour ?? ""}
                      onChange={(event) =>
                        setAreaForms((prev) => ({
                          ...prev,
                          [configuration.id]: {
                            ...(prev[configuration.id] ?? {
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
                          [configuration.id]: {
                            ...(prev[configuration.id] ?? {
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
                    <TextField
                      label="Depositum"
                      type="number"
                      value={form?.defaultDepositAmount ?? ""}
                      onChange={(event) =>
                        setAreaForms((prev) => ({
                          ...prev,
                          [configuration.id]: {
                            ...(prev[configuration.id] ?? {
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
                    <Button variant="outlined" onClick={() => saveArea(configuration.id)} disabled={areaSaving}>
                      Lagre priser
                    </Button>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>

        {archivedAreas.length > 0 && (
          <Stack spacing={2} pt={2} borderTop={1} borderColor="divider">
            <Typography variant="h5" component="h3">
              Arkiverte områder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Arkiverte områder kan ikke brukes til nye bookinger. Områder kan gjenoprettes.
            </Typography>
            {archivedAreas.map((configuration) => (
              <Box key={configuration.id} p={2} border={1} borderColor="divider" borderRadius={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="text.secondary">
                    {configuration.name}
                  </Typography>
                  <Button variant="outlined" size="small" onClick={() => handleRestoreArea(configuration.id)}>
                    Gjenopprett
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
