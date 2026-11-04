import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

import { UserAutocomplete, type UserOption } from "@/components/UserAutocomplete";
import {
  AllOrganizationsForAdminEditDocument,
  CreateNfcManualAccessDocument,
  NfcManualAccessesDocument,
  NfcUserSearchDocument,
  RemoveNfcManualAccessDocument,
} from "@/generated/graphql";

import { formatTime } from "./DoorAccessTable";
import { fromOsloInput, toErrorMessage } from "./helpers";

const SEARCH_LIMIT = 30;
const PEOPLE_LABEL: Record<string, string> = {
  LEADERS: "lederne",
  MEMBERS: "alle medlemmene",
};

type Target = "PERSON" | "ORGANIZATION";

type Props = {
  onChanged: () => void;
};

export function ManualAccessCard({ onChanged }: Readonly<Props>) {
  const [target, setTarget] = useState<Target>("PERSON");
  const [person, setPerson] = useState<UserOption | null>(null);
  const [organization, setOrganization] = useState<{ id: string; name: string } | null>(null);
  const [organizationPeople, setOrganizationPeople] = useState("LEADERS");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const {
    data,
    loading,
    error: listError,
    refetch,
  } = useQuery(NfcManualAccessesDocument, {
    ssr: false,
    fetchPolicy: "network-only",
  });
  const { data: organizations } = useQuery(AllOrganizationsForAdminEditDocument, {
    ssr: false,
    skip: target !== "ORGANIZATION",
  });
  const [searchPeople, people] = useLazyQuery(NfcUserSearchDocument, { fetchPolicy: "network-only" });
  const [createAccess, { loading: saving }] = useMutation(CreateNfcManualAccessDocument);
  const [removeAccess, { loading: removing }] = useMutation(RemoveNfcManualAccessDocument);

  const onSearch = useCallback(
    (query: string) => {
      searchPeople({ variables: { query, limit: SEARCH_LIMIT } }).catch(() => undefined);
    },
    [searchPeople]
  );

  const peopleOptions: UserOption[] = (people.data?.nfcUserSearch ?? []).map((user) => ({
    id: user.id,
    displayName: `${user.firstName} ${user.lastName} (${user.username})`,
    detail: user.feideEmail,
  }));

  const hasTarget = target === "PERSON" ? Boolean(person) : Boolean(organization);

  const onCreate = async () => {
    setError("");
    if (!startsAt || !endsAt) {
      setError("Fyll inn både fra og til.");
      return;
    }
    try {
      await createAccess({
        variables: {
          accessData: {
            ...(target === "PERSON"
              ? { userId: person?.id }
              : { organizationId: organization?.id, organizationPeople }),
            startsAt: fromOsloInput(startsAt),
            endsAt: fromOsloInput(endsAt),
            reason,
          },
        },
      });
    } catch (saveError) {
      setError(toErrorMessage(saveError, "Klarte ikke å gi adgang."));
      return;
    }
    setPerson(null);
    setOrganization(null);
    setStartsAt("");
    setEndsAt("");
    setReason("");
    await refetch();
    onChanged();
  };

  const onRemove = async (id: string) => {
    setError("");
    try {
      await removeAccess({ variables: { id } });
    } catch (removeError) {
      setError(toErrorMessage(removeError, "Klarte ikke å fjerne adgangen."));
      return;
    }
    await refetch();
    onChanged();
  };

  const accesses = data?.nfcManualAccesses ?? [];

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Gi adgang for en periode</Typography>
          <Typography variant="body2" color="text.secondary">
            Adgangen gis uten booking. Personen må ha kort og PIN.
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={target}
            sx={{ "& .MuiToggleButton-root.Mui-selected": { color: "text.primary", fontWeight: 600 } }}
            onChange={(_event, value: Target | null) => value && setTarget(value)}
          >
            <ToggleButton value="PERSON">Person</ToggleButton>
            <ToggleButton value="ORGANIZATION">Forening</ToggleButton>
          </ToggleButtonGroup>
          {target === "PERSON" ? (
            <UserAutocomplete
              label="Person"
              placeholder="Navn, e-post eller kortnummer"
              minLength={1}
              value={person}
              options={peopleOptions}
              loading={people.loading}
              onSearch={onSearch}
              onChange={setPerson}
            />
          ) : (
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Autocomplete
                fullWidth
                value={organization}
                options={organizations?.allOrganizations ?? []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, selected) => option.id === selected.id}
                onChange={(_event, value) => setOrganization(value)}
                renderInput={(params) => <TextField {...params} label="Forening" />}
              />
              <TextField
                select
                label="Hvem i foreningen"
                value={organizationPeople}
                sx={{ minWidth: 220 }}
                onChange={(event) => setOrganizationPeople(event.target.value)}
              >
                <MenuItem value="LEADERS">Lederne (HR)</MenuItem>
                <MenuItem value="MEMBERS">Alle medlemmene</MenuItem>
              </TextField>
            </Stack>
          )}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Fra"
              InputLabelProps={{ shrink: true }}
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Til"
              InputLabelProps={{ shrink: true }}
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
            />
          </Stack>
          <TextField
            label="Begrunnelse"
            inputProps={{ maxLength: 200 }}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" disabled={saving || !hasTarget} onClick={onCreate}>
              {saving ? "Lagrer..." : "Gi adgang"}
            </Button>
          </Stack>

          <Typography variant="subtitle1">Gjeldende og kommende ({accesses.length})</Typography>
          {loading && <CircularProgress size={24} />}
          {listError && <Alert severity="error">Kunne ikke hente listen.</Alert>}
          {!loading && !listError && accesses.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Ingen.
            </Typography>
          )}
          {accesses.map((access) => (
            <Stack
              key={access.id}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ md: "center" }}
              spacing={1}
            >
              <Typography variant="body2">
                <strong>{access.targetName}</strong>
                {": "}
                {formatTime(access.startsAt)} – {formatTime(access.endsAt)}
                {access.reason ? ` (${access.reason})` : ""}
                {access.createdByName ? `, gitt av ${access.createdByName}` : ""}
                {access.isOrganization ? `, ${PEOPLE_LABEL[access.organizationPeople] ?? ""}` : ""}
                {access.peopleCount === 0 ? " – gir ingen adgang nå" : ""}
              </Typography>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                disabled={removing}
                sx={{ flexShrink: 0 }}
                onClick={() => onRemove(access.id)}
              >
                Fjern
              </Button>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
