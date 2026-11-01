import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { AdminEditableUser } from "./types";

type Props = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  searchingUsers: boolean;
  searchFailed: boolean;
  searchResults: readonly AdminEditableUser[];
  selectedUser: AdminEditableUser | null;
  onSelectUser: (user: AdminEditableUser) => void;
};

export function UserSearchCard({
  searchInput,
  setSearchInput,
  onSearch,
  searchingUsers,
  searchFailed,
  searchResults,
  selectedUser,
  onSelectUser,
}: Readonly<Props>) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Finn bruker</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Søk"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ID, navn, brukernavn, Feide-id/e-post eller telefon"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" onClick={onSearch} fullWidth>
                Søk
              </Button>
            </Grid>
          </Grid>

          {searchingUsers && <CircularProgress size={24} />}
          {searchFailed && <Alert severity="error">Kunne ikke søke i brukere.</Alert>}

          {searchResults.length > 0 && (
            <List dense>
              {searchResults.map((user) => (
                <ListItemButton
                  key={user.id}
                  selected={selectedUser?.id === user.id}
                  onClick={() => onSelectUser(user)}
                >
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName} (${user.username})`}
                    secondary={`ID: ${user.id} ・ Epost/Feide: ${user.feideUserid || user.feideEmail || "-"} ・ Kortnummer: ${user.nfcCardNumber || user.nfcMifareCsn || "-"}`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
