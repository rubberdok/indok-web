"use client";

import { useMutation, useQuery } from "@apollo/client/react";
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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import {
  AllOrganizationsForAdminEditDocument,
  MembershipsDocument,
  RemoveMembershipDocument,
  UpsertMembershipDocument,
} from "@/generated/graphql";

import type { AdminEditableUser } from "./types";

function findSelectedMembership<T extends { user: { id: string } }>(
  memberships: T[] | null | undefined,
  userId: string | null | undefined
): T | null {
  if (!userId || !memberships) {
    return null;
  }
  return memberships.find((membership) => membership.user.id === userId) ?? null;
}

type Props = {
  selectedUser: AdminEditableUser | null;
  onSelectMembershipUser: (userId: string, username: string) => void;
};

/** Organisations and roles. Rendered only for those who may manage user profiles. */
export function MembershipCard({ selectedUser, onSelectMembershipUser }: Readonly<Props>) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [orgSearch, setOrgSearch] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const {
    data: orgData,
    loading: loadingOrgs,
    error: orgError,
  } = useQuery(AllOrganizationsForAdminEditDocument, {
    ssr: false,
    variables: { search: orgSearch || null },
  });

  const selectedOrg = useMemo(
    () => orgData?.allOrganizations?.find((org) => org.id === selectedOrgId),
    [orgData?.allOrganizations, selectedOrgId]
  );
  const defaultSelectedGroupId = selectedOrg?.primaryGroup?.id ?? selectedOrg?.permissionGroups?.[0]?.id ?? "";
  const selectedGroupIdIsValidForOrg =
    selectedOrg?.permissionGroups?.some((group) => group.id === selectedGroupId) ?? false;
  const effectiveSelectedGroupId = selectedGroupIdIsValidForOrg ? selectedGroupId : defaultSelectedGroupId;

  const {
    data: membershipsData,
    loading: loadingMemberships,
    refetch: refetchMemberships,
  } = useQuery(MembershipsDocument, {
    ssr: false,
    variables: { organizationId: selectedOrgId },
    skip: !selectedOrgId,
  });

  const [upsertMembership, { loading: savingMembership }] = useMutation(UpsertMembershipDocument);
  const [removeMembership, { loading: removingMembership }] = useMutation(RemoveMembershipDocument);

  const onSetMembershipRole = async () => {
    if (!selectedUser || !selectedOrg || !effectiveSelectedGroupId) {
      return;
    }

    await upsertMembership({
      variables: {
        membershipData: {
          userId: selectedUser.id,
          organizationId: selectedOrg.id,
          groupId: effectiveSelectedGroupId,
        },
      },
    });

    await refetchMemberships();
  };

  const onRemoveMembership = async (membershipId: string) => {
    await removeMembership({ variables: { membershipId } });
    await refetchMemberships();
  };

  const selectedMembership = findSelectedMembership(membershipsData?.memberships, selectedUser?.id);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Foreninger/Organisasjoner og roller</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Søk forening/organisasjon"
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Velg forening/organisasjon"
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
              >
                {(orgData?.allOrganizations || []).map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {loadingOrgs && <CircularProgress size={24} />}
          {orgError && <Alert severity="error">Kunne ikke hente foreninger/organisasjoner.</Alert>}

          {selectedOrg && (
            <Stack spacing={2}>
              <Typography variant="subtitle1">Medlemmer i {selectedOrg.name}</Typography>
              {loadingMemberships ? (
                <CircularProgress size={24} />
              ) : (
                <List dense>
                  {(membershipsData?.memberships || []).map((membership) => (
                    <ListItemButton
                      key={membership.id}
                      onClick={() => onSelectMembershipUser(membership.user.id, membership.user.username)}
                    >
                      <ListItemText
                        primary={`${membership.user.firstName} ${membership.user.lastName} (${membership.user.username})`}
                        secondary={membership.group?.name || "Uten gruppe"}
                      />
                      <Button
                        size="small"
                        color="error"
                        disabled={removingMembership}
                        onClick={(e) => {
                          e.stopPropagation();
                          void onRemoveMembership(membership.id);
                        }}
                      >
                        Fjern
                      </Button>
                    </ListItemButton>
                  ))}
                </List>
              )}

              {selectedUser && (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Gruppe for valgt bruker"
                      value={effectiveSelectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                    >
                      {(selectedOrg.permissionGroups || []).map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          {group.name} ({group.groupType})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" onClick={onSetMembershipRole} disabled={savingMembership}>
                        {savingMembership ? "Lagrer gruppe..." : `Sett gruppe for ${selectedUser.username}`}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        disabled={!selectedMembership || removingMembership}
                        onClick={() => selectedMembership && void onRemoveMembership(selectedMembership.id)}
                      >
                        Fjern valgt bruker fra forening/organisasjon
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
