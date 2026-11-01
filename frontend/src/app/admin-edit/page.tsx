"use client";

import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { Alert, Box, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { isAcceptedCardNumber } from "@/components/pages/profile/UserForm/helpers";
import {
  AdminEditCapabilitiesDocument,
  AdminUpdateUserDocument,
  AdminUpdateUserNfcDocument,
  NfcUserSearchDocument,
  UserSearchDocument,
} from "@/generated/graphql";

import { MembershipCard } from "./components/MembershipCard";
import { NfcFields } from "./components/NfcFields";
import { ProfileFields } from "./components/ProfileFields";
import {
  EMPTY_ADMIN_EDIT_FORM,
  MIFARE_CSN_RULE_TEXT,
  type AdminEditableUser,
  type AdminEditForm,
} from "./components/types";
import { UserSearchCard } from "./components/UserSearchCard";

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

function getAdminAccessDescription(canManageProfiles: boolean): string {
  if (canManageProfiles) {
    return "Søk etter bruker med ID, brukernavn, navn, Feide-ID/e-post eller telefon. ";
  }
  return "NFC-modus: Her kan du kun søke opp bruker og oppdatere kortnummer/PIN.";
}

export default function AdminEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nfcMode = searchParams?.get("mode") === "nfc";
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminEditableUser | null>(null);
  const [preselectedUserId, setPreselectedUserId] = useState<string>("");

  const [saveUserError, setSaveUserError] = useState<string>("");
  const [saveNfcError, setSaveNfcError] = useState<string>("");
  const [saveNfcSuccess, setSaveNfcSuccess] = useState<string>("");

  const [formData, setFormData] = useState<AdminEditForm>(EMPTY_ADMIN_EDIT_FORM);

  const {
    data: capabilityData,
    loading: loadingCapabilities,
    error: capabilityError,
  } = useQuery(AdminEditCapabilitiesDocument, {
    ssr: false,
  });

  const canManageProfiles = Boolean(capabilityData?.canManageUserProfiles);
  const canManageNfc = Boolean(capabilityData?.canManageUserNfc);
  const hasAnyAccess = canManageProfiles || canManageNfc;
  const nfcOnlyMode = canManageNfc && !canManageProfiles;

  useEffect(() => {
    if (!loadingCapabilities && !capabilityError && !hasAnyAccess) {
      router.replace("/");
    }
  }, [loadingCapabilities, capabilityError, hasAnyAccess, router]);

  useEffect(() => {
    if (loadingCapabilities || capabilityError || !hasAnyAccess) {
      return;
    }

    if (nfcOnlyMode && !nfcMode) {
      router.replace("/admin-edit/nfc");
    }
  }, [capabilityError, hasAnyAccess, loadingCapabilities, nfcMode, nfcOnlyMode, router]);

  const {
    data: userSearchData,
    loading: searchingProfileUsers,
    error: userSearchError,
  } = useQuery(UserSearchDocument, {
    ssr: false,
    variables: { query: searchQuery, limit: 30 },
    skip: !canManageProfiles || searchQuery.trim().length === 0,
  });

  const {
    data: nfcUserSearchData,
    loading: searchingNfcUsers,
    error: nfcUserSearchError,
  } = useQuery(NfcUserSearchDocument, {
    ssr: false,
    variables: { query: searchQuery, limit: 30 },
    skip: !canManageNfc || canManageProfiles || searchQuery.trim().length === 0,
  });

  const [runUserSearchById] = useLazyQuery(UserSearchDocument);
  const [runNfcUserSearchById] = useLazyQuery(NfcUserSearchDocument);

  const [adminUpdateUser, { loading: savingUser }] = useMutation(AdminUpdateUserDocument);
  const [adminUpdateUserNfc, { loading: savingNfc }] = useMutation(AdminUpdateUserNfcDocument);

  const searchResults: readonly AdminEditableUser[] =
    (canManageProfiles ? userSearchData?.userSearch : nfcUserSearchData?.nfcUserSearch) ?? [];

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
      nfcMifareCsn: user.nfcCardNumber ?? user.nfcMifareCsn ?? "",
      nfcPinCode: "",
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

    onSelectUser(user);
  };

  useEffect(() => {
    const userIdToSelect = (searchParams?.get("userId") || "").trim();
    if (!userIdToSelect) {
      return;
    }

    if (loadingCapabilities || capabilityError || !hasAnyAccess) {
      return;
    }

    if (preselectedUserId === userIdToSelect) {
      return;
    }

    const selectUserFromQuery = async () => {
      let foundUser: AdminEditableUser | null = null;

      if (canManageProfiles) {
        const result = await runUserSearchById({ variables: { query: userIdToSelect, limit: 1 } });
        foundUser = result.data?.userSearch?.find((candidate) => candidate.id === userIdToSelect) ?? null;
      } else if (canManageNfc) {
        const result = await runNfcUserSearchById({ variables: { query: userIdToSelect, limit: 1 } });
        foundUser = result.data?.nfcUserSearch?.find((candidate) => candidate.id === userIdToSelect) ?? null;
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

    const hasNewMifareCsn = formData.nfcMifareCsn.trim().length > 0;
    const hasExistingMifareCsn = Boolean(selectedUser.nfcMifareCsn);
    const pin = formData.nfcPinCode.trim();

    if (hasNewMifareCsn && !isAcceptedCardNumber(formData.nfcMifareCsn)) {
      return MIFARE_CSN_RULE_TEXT;
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
            pinCode: formData.nfcPinCode.trim() || null, // empty = keep the current PIN
            permanentAccess: formData.nfcPermanentAccess,
          },
        },
      });

      setSaveNfcSuccess("MIFARE kortnummer/PIN lagret.");

      if (canManageProfiles) {
        const updated = await runUserSearchById({ variables: { query: selectedUser.id, limit: 1 } });
        const updatedUser = updated.data?.userSearch?.find((candidate) => candidate.id === selectedUser.id);
        if (updatedUser) {
          onSelectUser(updatedUser);
        }
      }
    } catch (error) {
      setSaveNfcError(toErrorMessage(error, "Klarte ikke å lagre MIFARE kortnummer/PIN."));
    }
  };

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
      <Alert severity="info">{getAdminAccessDescription(canManageProfiles)}</Alert>

      <UserSearchCard
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={onSearch}
        searchingUsers={searchingUsers}
        searchFailed={Boolean(searchError)}
        searchResults={searchResults}
        selectedUser={selectedUser}
        onSelectUser={onSelectUser}
      />

      {selectedUser && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {canManageProfiles && <Typography variant="h6">Rediger bruker</Typography>}

              {canManageProfiles && (
                <ProfileFields
                  selectedUser={selectedUser}
                  formData={formData}
                  setFormData={setFormData}
                  saveUserError={saveUserError}
                  savingUser={savingUser}
                  onSaveUser={onSaveUser}
                />
              )}

              {canManageNfc && (
                <NfcFields
                  selectedUser={selectedUser}
                  formData={formData}
                  setFormData={setFormData}
                  canManageProfiles={canManageProfiles}
                  saveNfcError={saveNfcError}
                  setSaveNfcError={setSaveNfcError}
                  saveNfcSuccess={saveNfcSuccess}
                  setSaveNfcSuccess={setSaveNfcSuccess}
                  savingNfc={savingNfc}
                  onSaveNfc={onSaveNfc}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {canManageProfiles && (
        <MembershipCard selectedUser={selectedUser} onSelectMembershipUser={onSelectMembershipUser} />
      )}
    </Stack>
  );
}
