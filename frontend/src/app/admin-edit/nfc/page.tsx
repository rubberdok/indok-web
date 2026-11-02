"use client";

import { useQuery } from "@apollo/client/react";
import { ManageAccounts } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/app/components/Link";
import { AdminEditCapabilitiesDocument, NfcPermanentAccessUsersDocument, NfcUserDocument } from "@/generated/graphql";

import { NfcUserEditor } from "../components/NfcUserEditor";
import { PermanentAccessTable } from "../components/PermanentAccessTable";
import { UserSearchCard } from "../components/UserSearchCard";

export default function AdminEditNfcPage() {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    data: capabilityData,
    loading: loadingCapabilities,
    error: capabilityError,
  } = useQuery(AdminEditCapabilitiesDocument, { ssr: false });
  const canManageNfc = Boolean(capabilityData?.canManageUserNfc);

  useEffect(() => {
    if (!loadingCapabilities && !capabilityError && !canManageNfc) {
      router.replace("/");
    }
  }, [capabilityError, canManageNfc, loadingCapabilities, router]);

  const {
    data: holdersData,
    loading: loadingHolders,
    error: holdersError,
    refetch: refetchHolders,
  } = useQuery(NfcPermanentAccessUsersDocument, {
    ssr: false,
    skip: !canManageNfc,
    fetchPolicy: "network-only",
  });

  const {
    data: selectedData,
    loading: loadingSelected,
    refetch: refetchSelected,
  } = useQuery(NfcUserDocument, {
    ssr: false,
    variables: { id: selectedUserId ?? "" },
    skip: !selectedUserId,
    fetchPolicy: "network-only",
  });
  const selectedUser = selectedData?.nfcUser?.id === selectedUserId ? selectedData?.nfcUser : null;

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

  if (!canManageNfc) {
    return null;
  }

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "center" }}
        spacing={2}
      >
        <Typography variant="h4">NFC-kort og permanent tilgang</Typography>
        {capabilityData?.canManageUserProfiles && (
          <Button
            component={Link}
            noLinkStyle
            href="/admin-edit"
            color="inherit"
            variant="outlined"
            startIcon={<ManageAccounts />}
            sx={{ flexShrink: 0 }}
          >
            Brukeradministrasjon
          </Button>
        )}
      </Stack>
      <Alert severity="info">
        Her kan du søke opp brukere og endre kortnummer, PIN og permanent tilgang. Permanent tilgang åpner døra 24/7.
      </Alert>

      <div ref={searchRef}>
        <UserSearchCard
          canManageProfiles={false}
          selectedUser={selectedUser}
          onSelectUser={(user) => setSelectedUserId(user?.id ?? null)}
        />
      </div>

      {selectedUserId && !loadingSelected && !selectedUser && (
        <Alert severity="error">Kunne ikke hente brukeren.</Alert>
      )}

      {selectedUser && (
        <NfcUserEditor
          key={selectedUser.id}
          user={selectedUser}
          onSaved={async () => {
            const [saved] = await Promise.all([refetchSelected(), refetchHolders()]);
            return saved.data?.nfcUser;
          }}
        />
      )}

      <PermanentAccessTable
        users={holdersData?.nfcPermanentAccessUsers ?? []}
        loading={loadingHolders}
        failed={Boolean(holdersError)}
        onEdit={(userId) => {
          setSelectedUserId(userId);
          searchRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </Stack>
  );
}
