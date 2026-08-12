"use client";

import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { currentGradeYear, maxGraduationYear } from "@/components/pages/profile/UserForm/helpers";
import {
  AdminEditCapabilitiesDocument,
  AdminUpdateUserDocument,
  AdminUpdateUserNfcDocument,
  AllOrganizationsForAdminEditDocument,
  MembershipsDocument,
  NfcUserSearchDocument,
  RemoveMembershipDocument,
  UpsertMembershipDocument,
  UserSearchDocument,
} from "@/generated/graphql";

type AdminEditableUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  allergies?: string | null;
  graduationYear?: number | null;
  gradeYear?: number | null;
  dateJoined?: string | null;
  lastLogin?: string | null;
  feideUserid?: string | null;
  feideEmail?: string | null;
  nfcMifareCsn?: string | null;
  nfcPinCode?: string | null;
  nfcPermanentAccess?: boolean | null;
};

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof CombinedGraphQLErrors) {
    if (error.errors.length > 0) {
      return error.errors.map((e) => e.message).join(" · ");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function normalizeMifareCsn(identifier: string): string {
  return identifier.replace(/\D/g, "");
}

function isLegacyMifareHexCandidate(identifier: string): boolean {
  const compact = identifier.replace(/[^0-9a-fA-F]/g, "");
  return /^[0-9a-fA-F]{8}$/.test(compact);
}

export default function AdminEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nfcMode = searchParams?.get("mode") === "nfc";
  const isClientReady = true;
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminEditableUser | null>(null);
  const [preselectedUserId, setPreselectedUserId] = useState<string>("");

  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [orgSearch, setOrgSearch] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const [saveUserError, setSaveUserError] = useState<string>("");
  const [saveNfcError, setSaveNfcError] = useState<string>("");
  const [saveNfcSuccess, setSaveNfcSuccess] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    allergies: "",
    graduationYear: "",
    nfcMifareCsn: "",
    nfcPinCode: "",
    nfcPermanentAccess: false,
  });

  const {
    data: capabilityData,
    loading: capabilityLoading,
    error: capabilityError,
  } = useQuery(AdminEditCapabilitiesDocument, {
    ssr: false,
    skip: !isClientReady,
  });

  const loadingCapabilities = !isClientReady || capabilityLoading;

  const canManageProfiles = Boolean(capabilityData?.canManageUserProfiles);
  const canManageNfc = Boolean(capabilityData?.canManageUserNfc);
  const hasAnyAccess = canManageProfiles || canManageNfc;
  const nfcOnlyMode = canManageNfc && !canManageProfiles;

  const mifareCsnRuleText = "MIFARE CSN må være 10 sifre langt.";

  useEffect(() => {
    if (!isClientReady) {
      return;
    }

    if (!loadingCapabilities && !capabilityError && !hasAnyAccess) {
      router.replace("/");
    }
  }, [isClientReady, loadingCapabilities, capabilityError, hasAnyAccess, router]);

  useEffect(() => {
    if (!isClientReady || loadingCapabilities || capabilityError || !hasAnyAccess) {
      return;
    }

    if (nfcOnlyMode && !nfcMode) {
      router.replace("/admin-edit/nfc");
    }
  }, [isClientReady, capabilityError, hasAnyAccess, loadingCapabilities, nfcMode, nfcOnlyMode, router]);

  const {
    data: userSearchData,
    loading: searchingProfileUsers,
    error: userSearchError,
  } = useQuery(UserSearchDocument, {
    ssr: false,
    variables: { query: searchQuery, limit: 30 },
    skip: !isClientReady || !canManageProfiles || searchQuery.trim().length === 0,
  });

  const {
    data: nfcUserSearchData,
    loading: searchingNfcUsers,
    error: nfcUserSearchError,
  } = useQuery(NfcUserSearchDocument, {
    ssr: false,
    variables: { query: searchQuery, limit: 30 },
    skip: !isClientReady || !canManageNfc || canManageProfiles || searchQuery.trim().length === 0,
  });

  const [runUserSearchById] = useLazyQuery(UserSearchDocument);
  const [runNfcUserSearchById] = useLazyQuery(NfcUserSearchDocument);

  const {
    data: orgData,
    loading: loadingOrgs,
    error: orgError,
  } = useQuery(AllOrganizationsForAdminEditDocument, {
    ssr: false,
    variables: { search: orgSearch || null },
    skip: !isClientReady || !canManageProfiles,
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
    skip: !isClientReady || !canManageProfiles || !selectedOrgId,
  });

  const [adminUpdateUser, { loading: savingUser }] = useMutation(AdminUpdateUserDocument);
  const [adminUpdateUserNfc, { loading: savingNfc }] = useMutation(AdminUpdateUserNfcDocument);
  const [upsertMembership, { loading: savingMembership }] = useMutation(UpsertMembershipDocument);
  const [removeMembership, { loading: removingMembership }] = useMutation(RemoveMembershipDocument);

  const currentYear = new Date().getFullYear();
  const minimumGraduationYear = Math.min(currentYear, selectedUser?.graduationYear ?? currentYear);
  const graduationYears = Array.from(
    { length: maxGraduationYear - minimumGraduationYear + 1 },
    (_, i) => minimumGraduationYear + i
  );

  const searchResults: AdminEditableUser[] = useMemo(() => {
    if (canManageProfiles) {
      return (
        userSearchData?.userSearch?.map((u) => ({
          id: u.id,
          username: u.username,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phoneNumber: u.phoneNumber,
          allergies: u.allergies,
          graduationYear: u.graduationYear,
          gradeYear: u.gradeYear,
          dateJoined: u.dateJoined,
          lastLogin: u.lastLogin,
          feideUserid: u.feideUserid,
          feideEmail: u.feideEmail,
          nfcMifareCsn: u.nfcMifareCsn,
          nfcPinCode: u.nfcPinCode,
          nfcPermanentAccess: u.nfcPermanentAccess,
        })) ?? []
      );
    }

    return (
      nfcUserSearchData?.nfcUserSearch?.map((u) => ({
        id: u.id,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        feideEmail: u.feideEmail,
        nfcMifareCsn: u.nfcMifareCsn,
        nfcPinCode: u.nfcPinCode,
        nfcPermanentAccess: u.nfcPermanentAccess,
      })) ?? []
    );
  }, [canManageProfiles, nfcUserSearchData?.nfcUserSearch, userSearchData?.userSearch]);

  const onSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const onSelectUser = (user: AdminEditableUser) => {
    setSelectedUser(user);
    setSaveNfcError("");
    setSaveNfcSuccess("");
    setSaveUserError("");

    setFormData({
      username: user.username ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      allergies: user.allergies ?? "",
      graduationYear: user.graduationYear?.toString() ?? "",
      nfcMifareCsn: user.nfcMifareCsn ?? "",
      nfcPinCode: user.nfcPinCode ?? "",
      nfcPermanentAccess: Boolean(user.nfcPermanentAccess),
    });
  };

  const onSelectMembershipUser = async (userId: string, username: string) => {
    if (!canManageProfiles) {
      return;
    }

    let result = await runUserSearchById({ variables: { query: username, limit: 10 } });
    let user = result.data?.userSearch?.find((candidate) => candidate.id === userId);

    if (!user) {
      result = await runUserSearchById({ variables: { query: userId, limit: 10 } });
      user = result.data?.userSearch?.find((candidate) => candidate.id === userId);
    }

    if (!user) {
      return;
    }

    onSelectUser({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      allergies: user.allergies,
      graduationYear: user.graduationYear,
      gradeYear: user.gradeYear,
      dateJoined: user.dateJoined,
      lastLogin: user.lastLogin,
      feideUserid: user.feideUserid,
      feideEmail: user.feideEmail,
      nfcMifareCsn: user.nfcMifareCsn,
      nfcPinCode: user.nfcPinCode,
      nfcPermanentAccess: user.nfcPermanentAccess,
    });
  };

  useEffect(() => {
    const userIdToSelect = (searchParams?.get("userId") || "").trim();
    if (!userIdToSelect) {
      return;
    }

    if (!isClientReady || loadingCapabilities || capabilityError || !hasAnyAccess) {
      return;
    }

    if (preselectedUserId === userIdToSelect) {
      return;
    }

    const selectUserFromQuery = async () => {
      let foundUser: AdminEditableUser | null = null;

      if (canManageProfiles) {
        const result = await runUserSearchById({ variables: { query: userIdToSelect, limit: 1 } });
        const user = result.data?.userSearch?.find((candidate) => candidate.id === userIdToSelect);
        if (user) {
          foundUser = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            allergies: user.allergies,
            graduationYear: user.graduationYear,
            gradeYear: user.gradeYear,
            dateJoined: user.dateJoined,
            lastLogin: user.lastLogin,
            feideUserid: user.feideUserid,
            feideEmail: user.feideEmail,
            nfcMifareCsn: user.nfcMifareCsn,
            nfcPinCode: user.nfcPinCode,
            nfcPermanentAccess: user.nfcPermanentAccess,
          };
        }
      } else if (canManageNfc) {
        const result = await runNfcUserSearchById({ variables: { query: userIdToSelect, limit: 1 } });
        const user = result.data?.nfcUserSearch?.find((candidate) => candidate.id === userIdToSelect);
        if (user) {
          foundUser = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            feideEmail: user.feideEmail,
            nfcMifareCsn: user.nfcMifareCsn,
            nfcPinCode: user.nfcPinCode,
            nfcPermanentAccess: user.nfcPermanentAccess,
          };
        }
      }

      if (foundUser) {
        onSelectUser(foundUser);
        setSearchInput(userIdToSelect);
        setSearchQuery(userIdToSelect);
      }

      setPreselectedUserId(userIdToSelect);
    };

    void selectUserFromQuery();
  }, [
    capabilityError,
    canManageNfc,
    canManageProfiles,
    hasAnyAccess,
    isClientReady,
    loadingCapabilities,
    preselectedUserId,
    runNfcUserSearchById,
    runUserSearchById,
    searchParams,
  ]);

  const validateNfcInput = (): string | null => {
    if (!selectedUser) {
      return "Velg en bruker først.";
    }

    const normalizedDigits = normalizeMifareCsn(formData.nfcMifareCsn);
    const hasNewMifareCsn = formData.nfcMifareCsn.trim().length > 0;
    const hasExistingMifareCsn = Boolean(selectedUser.nfcMifareCsn);
    const pin = formData.nfcPinCode.trim();

    const isValidCsnInput = /^\d{10}$/.test(normalizedDigits);
    const isValidLegacyMifareHexInput = isLegacyMifareHexCandidate(formData.nfcMifareCsn);
    if (hasNewMifareCsn && !isValidCsnInput && !isValidLegacyMifareHexInput) {
      return mifareCsnRuleText;
    }

    if (pin.length > 0 && !/^\d{4}$/.test(pin)) {
      return "PIN-kode må være nøyaktig 4 sifre.";
    }

    if (pin.length > 0 && !hasNewMifareCsn && !hasExistingMifareCsn) {
      return "Du må sette et kortnummer før PIN-kode kan lagres.";
    }

    return null;
  };

  const onSaveUser = async () => {
    if (!selectedUser || !canManageProfiles) {
      return;
    }

    setSaveUserError("");

    try {
      await adminUpdateUser({
        variables: {
          userId: selectedUser.id,
          userData: {
            username: formData.username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            allergies: formData.allergies,
            graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null,
          },
        },
      });
    } catch (error) {
      setSaveUserError(toErrorMessage(error, "Klarte ikke å lagre bruker."));
    }
  };

  const onSaveNfc = async () => {
    if (!selectedUser || !canManageNfc) {
      return;
    }

    setSaveNfcError("");
    setSaveNfcSuccess("");

    const validationMessage = validateNfcInput();
    if (validationMessage) {
      setSaveNfcError(validationMessage);
      return;
    }

    try {
      await adminUpdateUserNfc({
        variables: {
          userId: selectedUser.id,
          nfcData: {
            mifareCsn: formData.nfcMifareCsn.trim() || null,
            pinCode: formData.nfcPinCode.trim(),
            permanentAccess: formData.nfcPermanentAccess,
          },
        },
      });

      setSaveNfcSuccess("MIFARE kortnummer/PIN lagret.");

      if (canManageProfiles) {
        const updated = await runUserSearchById({ variables: { query: selectedUser.id, limit: 1 } });
        const updatedUser = updated.data?.userSearch?.find((candidate) => candidate.id === selectedUser.id);
        if (updatedUser) {
          onSelectUser({
            id: updatedUser.id,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            allergies: updatedUser.allergies,
            graduationYear: updatedUser.graduationYear,
            gradeYear: updatedUser.gradeYear,
            dateJoined: updatedUser.dateJoined,
            lastLogin: updatedUser.lastLogin,
            feideUserid: updatedUser.feideUserid,
            feideEmail: updatedUser.feideEmail,
            nfcMifareCsn: updatedUser.nfcMifareCsn,
            nfcPinCode: updatedUser.nfcPinCode,
            nfcPermanentAccess: updatedUser.nfcPermanentAccess,
          });
        }
      }
    } catch (error) {
      setSaveNfcError(toErrorMessage(error, "Klarte ikke å lagre MIFARE kortnummer/PIN."));
    }
  };

  const onSetMembershipRole = async () => {
    if (!selectedUser || !selectedOrg || !effectiveSelectedGroupId || !canManageProfiles) {
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
    if (!canManageProfiles) {
      return;
    }

    await removeMembership({ variables: { membershipId } });
    await refetchMemberships();
  };

  const selectedMembership =
    selectedUser && membershipsData?.memberships
      ? (membershipsData.memberships.find((membership) => membership.user.id === selectedUser.id) ?? null)
      : null;

  if (loadingCapabilities) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (capabilityError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Kunne ikke hente tilgangsinformasjon.</Alert>
      </Box>
    );
  }

  if (!hasAnyAccess) {
    return null;
  }

  const searchingUsers = searchingProfileUsers || searchingNfcUsers;
  const searchError = userSearchError ?? nfcUserSearchError;

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">Generell bruker og Forening/Organisasjon administasjon</Typography>
      <Alert severity="info">
        {canManageProfiles
          ? "Søk etter bruker med ID, brukernavn, navn, Feide-ID/e-post eller telefon. "
          : "NFC-modus: Her kan du kun søke opp bruker og oppdatere kortnummer/PIN."}
      </Alert>

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
            {searchError && <Alert severity="error">Kunne ikke søke i brukere.</Alert>}

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
                      secondary={`ID: ${user.id} ・ Epost/Feide: ${user.feideUserid || user.feideEmail || "-"} ・ Kortnummer: ${user.nfcMifareCsn || "-"}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Stack>
        </CardContent>
      </Card>

      {selectedUser && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {canManageProfiles && <Typography variant="h6">Rediger bruker</Typography>}

              {canManageProfiles && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Brukernavn"
                        fullWidth
                        value={formData.username}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Feide bruker-id"
                        fullWidth
                        value={selectedUser.feideUserid || ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Fornavn"
                        fullWidth
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Etternavn"
                        fullWidth
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="E-post"
                        fullWidth
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Feide e-post"
                        fullWidth
                        value={selectedUser.feideEmail || ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Telefon"
                        fullWidth
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Allergier"
                        fullWidth
                        value={formData.allergies}
                        onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Klasse"
                        fullWidth
                        value={selectedUser.gradeYear ?? ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        label="Uteksamineringsår"
                        fullWidth
                        value={formData.graduationYear}
                        onChange={(e) => setFormData((prev) => ({ ...prev, graduationYear: e.target.value }))}
                      >
                        {graduationYears.map((year) => (
                          <MenuItem key={year} value={String(year)}>
                            {`${year} (${currentGradeYear(year)}. klasse)`}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Sist innlogget"
                        fullWidth
                        value={selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Opprettet"
                        fullWidth
                        value={selectedUser.dateJoined ? new Date(selectedUser.dateJoined).toLocaleString() : ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>

                  {saveUserError && <Alert severity="error">{saveUserError}</Alert>}

                  <Box>
                    <Button variant="contained" onClick={onSaveUser} disabled={savingUser}>
                      {savingUser ? "Lagrer..." : "Lagre bruker"}
                    </Button>
                  </Box>
                </>
              )}

              {canManageNfc && (
                <>
                  <Typography variant="subtitle1">MIFARE kortnummer/PIN</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="MIFARE kortnummer"
                        fullWidth
                        value={formData.nfcMifareCsn}
                        onChange={(e) => {
                          setSaveNfcError("");
                          setSaveNfcSuccess("");
                          setFormData((prev) => ({ ...prev, nfcMifareCsn: e.target.value }));
                        }}
                        placeholder="F.eks. 1234567890"
                        helperText={mifareCsnRuleText}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="PIN-kode (4 sifre)"
                        fullWidth
                        value={formData.nfcPinCode}
                        onChange={(e) => {
                          setSaveNfcError("");
                          setSaveNfcSuccess("");
                          setFormData((prev) => ({ ...prev, nfcPinCode: e.target.value }));
                        }}
                        inputProps={{ maxLength: 4, inputMode: "numeric", pattern: "[0-9]{4}" }}
                        helperText="PIN krever at bruker har kortnummer (eksisterende eller nytt)."
                      />
                    </Grid>
                  </Grid>
                  {canManageProfiles && (
                    <Box>
                      <Typography variant="subtitle1">Permanent tilgang</Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(formData.nfcPermanentAccess)}
                            onChange={(_, checked) => {
                              setSaveNfcError("");
                              setSaveNfcSuccess("");
                              setFormData((prev) => ({ ...prev, nfcPermanentAccess: checked }));
                            }}
                          />
                        }
                        label={formData.nfcPermanentAccess ? "Tilgang aktiv" : "Tilgang deaktivert"}
                      />
                    </Box>
                  )}
                  {saveNfcError && <Alert severity="error">{saveNfcError}</Alert>}
                  {saveNfcSuccess && <Alert severity="success">{saveNfcSuccess}</Alert>}

                  <Box>
                    <Button variant="contained" onClick={onSaveNfc} disabled={savingNfc}>
                      {savingNfc ? "Lagrer MIFARE..." : "Lagret MIFARE kortnummer/PIN"}
                    </Button>
                  </Box>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {canManageProfiles && (
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
      )}
    </Stack>
  );
}
