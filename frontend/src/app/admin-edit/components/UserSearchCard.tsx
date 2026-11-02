import { useLazyQuery } from "@apollo/client/react";
import { Alert, Card, CardContent, Stack, Typography } from "@mui/material";
import { useCallback } from "react";

import { UserAutocomplete, type UserOption } from "@/components/UserAutocomplete";
import { NfcUserSearchDocument, UserSearchDocument } from "@/generated/graphql";

import type { AdminEditableUser } from "./types";

const SEARCH_LIMIT = 30;

function toOption(user: AdminEditableUser): UserOption {
  return {
    id: user.id,
    displayName: `${user.firstName} ${user.lastName} (${user.username})`,
    detail: `ID: ${user.id} ・ Epost/Feide: ${user.feideUserid || user.feideEmail || "-"} ・ Kortnummer: ${user.nfcCardNumber || user.nfcMifareCsn || "-"}`,
  };
}

type Props = {
  canManageProfiles: boolean;
  selectedUser: AdminEditableUser | null;
  onSelectUser: (user: AdminEditableUser | null) => void;
};

export function UserSearchCard({ canManageProfiles, selectedUser, onSelectUser }: Readonly<Props>) {
  const [searchProfiles, profiles] = useLazyQuery(UserSearchDocument, { fetchPolicy: "network-only" });
  const [searchNfc, nfc] = useLazyQuery(NfcUserSearchDocument, { fetchPolicy: "network-only" });

  const onSearch = useCallback(
    (query: string) => {
      const variables = { query, limit: SEARCH_LIMIT };
      const search = canManageProfiles ? searchProfiles({ variables }) : searchNfc({ variables });
      search.catch(() => undefined); // shown from the query's error below
    },
    [canManageProfiles, searchNfc, searchProfiles]
  );

  const results: readonly AdminEditableUser[] =
    (canManageProfiles ? profiles.data?.userSearch : nfc.data?.nfcUserSearch) ?? [];

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Finn bruker</Typography>
          <UserAutocomplete
            label="Søk"
            placeholder="ID, navn, brukernavn, Feide-id/e-post eller telefon"
            minLength={1}
            value={selectedUser ? toOption(selectedUser) : null}
            options={results.map(toOption)}
            loading={profiles.loading || nfc.loading}
            onSearch={onSearch}
            onChange={(option) => onSelectUser(results.find((user) => user.id === option?.id) ?? null)}
          />
          {(profiles.error ?? nfc.error) && <Alert severity="error">Kunne ikke søke i brukere.</Alert>}
        </Stack>
      </CardContent>
    </Card>
  );
}
