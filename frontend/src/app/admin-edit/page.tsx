"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { Nfc } from "@mui/icons-material";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/app/components/Link";
import {
  AdminEditCapabilitiesDocument,
  AdminUpdateUserDocument,
  AdminUpdateUserNfcDocument,
  AdminUserDocument,
} from "@/generated/graphql";

import { adminEditFormFor, nfcInputFor, toErrorMessage, validateNfcInput } from "./components/helpers";
import { MembershipCard } from "./components/MembershipCard";
import { NfcFields } from "./components/NfcFields";
import { ProfileFields } from "./components/ProfileFields";
import { EMPTY_ADMIN_EDIT_FORM, type AdminEditableUser, type AdminEditForm } from "./components/types";
import { UserSearchCard } from "./components/UserSearchCard";

export default function AdminEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<AdminEditableUser | null>(null);
  const preselectedUserId = useRef("");

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

  useEffect(() => {
    if (loadingCapabilities || capabilityError || canManageProfiles) {
      return;
    }

    router.replace(canManageNfc ? "/admin-edit/nfc" : "/");
  }, [capabilityError, canManageNfc, canManageProfiles, loadingCapabilities, router]);

  const [runAdminUser] = useLazyQuery(AdminUserDocument, { fetchPolicy: "network-only" });

  const [adminUpdateUser, { loading: savingUser }] = useMutation(AdminUpdateUserDocument);
  const [adminUpdateUserNfc, { loading: savingNfc }] = useMutation(AdminUpdateUserNfcDocument);

  const onSelectUser = (user: AdminEditableUser | null) => {
    setSelectedUser(user);
    setSaveNfcError("");
    setSaveNfcSuccess("");
    setSaveUserError("");
    setFormData(user ? adminEditFormFor(user) : EMPTY_ADMIN_EDIT_FORM);
  };

  const selectUserById = async (userId: string) => {
    const result = await runAdminUser({ variables: { id: userId } });
    if (result.data?.adminUser) {
      onSelectUser(result.data.adminUser);
    }
  };

  useEffect(() => {
    const userIdToSelect = (searchParams?.get("userId") || "").trim();
    if (!userIdToSelect || !canManageProfiles || preselectedUserId.current === userIdToSelect) {
      return;
    }

    preselectedUserId.current = userIdToSelect;

    runAdminUser({ variables: { id: userIdToSelect } })
      .then((result) => {
        if (result.data?.adminUser) {
          setSelectedUser(result.data.adminUser);
          setFormData(adminEditFormFor(result.data.adminUser));
        }
      })
      .catch(() => undefined);
  }, [canManageProfiles, runAdminUser, searchParams]);

  const onSaveUser = async () => {
    if (!selectedUser) {
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
    setSaveNfcError("");
    setSaveNfcSuccess("");

    if (!selectedUser) {
      setSaveNfcError("Velg en bruker først.");
      return;
    }

    const validationMessage = validateNfcInput(selectedUser, formData);
    if (validationMessage) {
      setSaveNfcError(validationMessage);
      return;
    }

    try {
      await adminUpdateUserNfc({
        variables: {
          userId: selectedUser.id,
          nfcData: nfcInputFor(selectedUser, formData, { withNote: false }),
        },
      });

      await selectUserById(selectedUser.id);
      setSaveNfcSuccess("MIFARE kortnummer/PIN lagret.");
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

  if (!canManageProfiles) {
    return null; // on the way to the NFC page or the front page
  }

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "center" }}
        spacing={2}
      >
        <Typography variant="h4">Generell bruker og Forening/Organisasjon administrasjon</Typography>
        {canManageNfc && (
          <Button
            component={Link}
            noLinkStyle
            href="/admin-edit/nfc"
            color="inherit"
            variant="outlined"
            startIcon={<Nfc />}
            sx={{ flexShrink: 0 }}
          >
            NFC-edit
          </Button>
        )}
      </Stack>
      <Alert severity="info">Søk etter bruker med ID, brukernavn, navn, Feide-ID/e-post eller telefon.</Alert>

      <UserSearchCard canManageProfiles selectedUser={selectedUser} onSelectUser={onSelectUser} />

      {selectedUser && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Rediger bruker</Typography>

              <ProfileFields
                selectedUser={selectedUser}
                formData={formData}
                setFormData={setFormData}
                saveUserError={saveUserError}
                savingUser={savingUser}
                onSaveUser={onSaveUser}
              />

              <NfcFields
                selectedUser={selectedUser}
                formData={formData}
                setFormData={setFormData}
                saveNfcError={saveNfcError}
                setSaveNfcError={setSaveNfcError}
                saveNfcSuccess={saveNfcSuccess}
                setSaveNfcSuccess={setSaveNfcSuccess}
                savingNfc={savingNfc}
                onSaveNfc={onSaveNfc}
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      <MembershipCard
        selectedUser={selectedUser}
        onSelectMembershipUser={(userId) => {
          selectUserById(userId).catch(() => undefined);
        }}
      />
    </Stack>
  );
}
