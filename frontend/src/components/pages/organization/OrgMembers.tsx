import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useMutation, useQuery } from "@apollo/client/react";
import { Delete, GroupAdd, AdminPanelSettings } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { orderBy } from "lodash";
import { useState } from "react";

import {
  AdminOrganizationFragment,
  HasPermissionDocument,
  MembershipsDocument,
  RemoveMembershipDocument,
  UpsertMembershipDocument,
  UserDocument,
  UserSearchDocument,
} from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
};

export const OrgMembers: React.FC<Props> = ({ organization }) => {
  const { data, loading, error, refetch } = useQuery(MembershipsDocument, {
    variables: { organizationId: organization.id },
  });
  const { data: currentUserData } = useQuery(UserDocument);
  const { data: manageOrganizationPermissionData } = useQuery(HasPermissionDocument, {
    variables: { permission: "organizations.manage_organization" },
  });

  const { refetch: refetchUserSearch } = useQuery(UserSearchDocument, {
    variables: { query: "", limit: 10 },
    skip: true,
  });

  const [upsertMembership, { loading: upsertingMembership }] = useMutation(UpsertMembershipDocument);
  const [removeMembership, { loading: removingMembership }] = useMutation(RemoveMembershipDocument);

  const [feedbackError, setFeedbackError] = useState<string>("");
  const [feedbackSuccess, setFeedbackSuccess] = useState<string>("");

  const [userInput, setUserInput] = useState<string>("");

  if (error) return <p>Error</p>;
  if (!data?.memberships || loading) return <CircularProgress />;

  //Sorterer medlemmer alfabetisk
  const memberships = orderBy(data?.memberships, "user.firstName", "asc");
  const currentUserId = currentUserData?.user?.id;
  const isHrMember = Boolean(
    currentUserId &&
    memberships.some(
      (membership) => membership.user.id === currentUserId && membership?.group?.uuid === organization.hrGroup?.uuid
    )
  );
  const canEditMemberships = isHrMember || Boolean(manageOrganizationPermissionData?.hasPermission);

  const toErrorMessage = (err: unknown, fallback: string): string => {
    if (err instanceof CombinedGraphQLErrors) {
      if (err.errors.length > 0) {
        return err.errors.map((graphQLError) => graphQLError.message).join(" · ");
      }
    }

    if (err instanceof Error) {
      return err.message;
    }

    return fallback;
  };

  const clearFeedback = () => {
    setFeedbackError("");
    setFeedbackSuccess("");
  };

  const getMemberGroupId = (): string | undefined => {
    return organization.primaryGroup?.id ?? undefined;
  };

  const getAdminGroupId = (): string | undefined => {
    return organization.hrGroup?.id ?? undefined;
  };

  const addUser = async () => {
    clearFeedback();

    const input = userInput.trim();
    if (!input) {
      setFeedbackError("Skriv inn brukernavn, bruker-ID eller fullt navn.");
      return;
    }

    const memberGroupId = getMemberGroupId();
    if (!memberGroupId) {
      setFeedbackError("Organisasjonen mangler standard medlemsgruppe.");
      return;
    }

    try {
      let userId: string | undefined;

      if (/^\d+$/.test(input)) {
        userId = input;
      } else {
        const result = await refetchUserSearch({ query: input, limit: 10 });
        const candidates = result.data?.userSearch ?? [];

        const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
        const normalizedInput = normalize(input);

        const exactUsernameMatch = candidates.find((candidate) => normalize(candidate.username) === normalizedInput);
        if (exactUsernameMatch) {
          userId = exactUsernameMatch.id;
        } else {
          const exactFullNameMatches = candidates.filter(
            (candidate) => normalize(`${candidate.firstName} ${candidate.lastName}`) === normalizedInput
          );

          if (exactFullNameMatches.length === 1) {
            userId = exactFullNameMatches[0].id;
          } else if (exactFullNameMatches.length > 1) {
            setFeedbackError(`Fant flere brukere med navnet "${input}". Bruk brukernavn for å velge riktig person.`);
            return;
          } else if (candidates.length === 1) {
            userId = candidates[0].id;
          }
        }
      }

      if (!userId) {
        setFeedbackError("Fant ingen unik bruker som matcher søket. Prøv brukernavn.");
        return;
      }

      const alreadyMember = memberships.some((membership) => membership.user.id === userId);
      if (alreadyMember) {
        setFeedbackError("Brukeren er allerede medlem i organisasjonen.");
        return;
      }

      await upsertMembership({
        variables: {
          membershipData: {
            userId,
            organizationId: organization.id,
            groupId: memberGroupId,
          },
        },
      });

      setUserInput("");
      setFeedbackSuccess("Bruker lagt til som medlem.");
      await refetch();
    } catch (err) {
      setFeedbackError(toErrorMessage(err, "Klarte ikke å legge til bruker."));
    }
  };

  const promoteOrDemote = async (userId: string, isAdmin: boolean) => {
    clearFeedback();

    const targetGroupId = isAdmin ? getMemberGroupId() : getAdminGroupId();
    if (!targetGroupId) {
      setFeedbackError(
        isAdmin ? "Organisasjonen mangler standard medlemsgruppe." : "Organisasjonen mangler administratorgruppe."
      );
      return;
    }

    try {
      await upsertMembership({
        variables: {
          membershipData: {
            userId,
            organizationId: organization.id,
            groupId: targetGroupId,
          },
        },
      });

      setFeedbackSuccess(isAdmin ? "Bruker demotert til medlem." : "Bruker promotert til administrator.");
      await refetch();
    } catch (err) {
      setFeedbackError(toErrorMessage(err, "Klarte ikke å oppdatere rolle."));
    }
  };

  const removeUser = async (membershipId: string) => {
    clearFeedback();

    try {
      await removeMembership({ variables: { membershipId } });
      setFeedbackSuccess("Bruker fjernet fra foreningen/organisasjonen.");
      await refetch();
    } catch (err) {
      setFeedbackError(toErrorMessage(err, "Klarte ikke å fjerne bruker."));
    }
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt over medlemmer</Typography>
      {feedbackError && <Alert severity="error">{feedbackError}</Alert>}
      {feedbackSuccess && <Alert severity="success">{feedbackSuccess}</Alert>}
      {canEditMemberships ? (
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Skriv inn brukernavn, bruker-ID eller fullt navn"
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Button startIcon={<GroupAdd />} onClick={() => void addUser()} disabled={upsertingMembership}>
              Legg til
            </Button>
          </Grid>
        </Grid>
      ) : null}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Navn</TableCell>
              <TableCell>Gruppe</TableCell>
              {canEditMemberships ? <TableCell>Rediger</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {memberships.map((membership) => (
              <TableRow key={membership.id}>
                <TableCell>
                  {membership.user.firstName} {membership.user.lastName}
                </TableCell>
                <TableCell>
                  {membership?.group?.name === "HR" ? "Administrator" : (membership?.group?.name ?? "--")}
                </TableCell>
                {canEditMemberships ? (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<AdminPanelSettings />}
                      sx={{ mr: 1 }}
                      disabled={upsertingMembership || removingMembership}
                      onClick={() =>
                        void promoteOrDemote(membership.user.id, membership?.group?.uuid === organization.hrGroup?.uuid)
                      }
                    >
                      {membership?.group?.uuid === organization.hrGroup?.uuid ? "Demoter" : "Promoter"}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                      disabled={upsertingMembership || removingMembership}
                      onClick={() => void removeUser(membership.id)}
                    >
                      Fjern
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
