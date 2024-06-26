"use client";

import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Add, MoreVert } from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

import { graphql } from "@/gql/app";
import { Role } from "@/gql/app/graphql";
import { AddMemberDialog } from "./_components/AddMemberDialog";
import { useAlerts } from "@/app/components/Alerts";

export default function Page({ params }: { params: { organizationId: string } }) {
  const { organizationId } = params;
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const { data } = useSuspenseQuery(
    graphql(`
      query AdminOrganizationsPageMembers($organizationId: ID!) {
        organization(data: { id: $organizationId }) {
          organization {
            id
            members {
              id
              user {
                id
                firstName
                lastName
              }
              role
            }
          }
        }
        user {
          user {
            id
          }
        }
        hasRole(data: { organizationId: $organizationId, role: ADMIN }) {
          hasRole
        }
      }
    `),
    { variables: { organizationId } }
  );

  const { organization } = data.organization;
  const { members } = organization;
  const { hasRole: isAdmin } = data.hasRole;
  const { user } = data.user;
  if (!user) return notFound();

  return (
    <>
      <AddMemberDialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)} organizationId={organizationId} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Navn</TableCell>
              <TableCell>Rolle</TableCell>
              <TableCell align="center">
                <Tooltip title="Legg til nytt medlem" arrow placement="top">
                  <IconButton onClick={() => setAddMemberOpen(true)}>
                    <Add />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{`${member.user.firstName} ${member.user.lastName}`}</TableCell>
                <TableCell>{member.role}</TableCell>
                <ActionTableCell user={user} isAdmin={isAdmin} member={member} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

type ActionTableCellProps = {
  user: { id: string };
  isAdmin: boolean;
  member: {
    id: string;
    role: Role;
    user: { id: string; firstName: string; lastName: string };
  };
};

function ActionTableCell({ user, isAdmin, member }: ActionTableCellProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { notify } = useAlerts();
  const [updateRole] = useMutation(
    graphql(`
      mutation OrganizationsAdminMembersPage_UpdateRole($data: UpdateRoleInput!) {
        updateRole(data: $data) {
          member {
            id
            role
            user {
              id
              firstName
              lastName
            }
          }
        }
      }
    `),
    {
      onCompleted(data) {
        setMenuAnchorEl(null);
        notify({
          title: "Rolle oppdatert",
          message: `${data.updateRole.member.user.firstName} ${data.updateRole.member.user.lastName} er nå ${data.updateRole.member.role}`,
          type: "success",
        });
      },
      onError(error) {
        notify({ title: "Kunne ikke oppdatere rolle", message: error.message, type: "error" });
      },
    }
  );
  const router = useRouter();
  const [removeMember] = useMutation(
    graphql(`
      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {
        removeMember(data: $data) {
          member {
            id
            user {
              id
              firstName
              lastName
            }
          }
        }
      }
    `),
    {
      onCompleted(data) {
        const removedUser = data.removeMember.member.user;
        setMenuAnchorEl(null);
        notify({
          title: "Medlem fjernet",
          message: `${removedUser.firstName} ${removedUser.lastName} er nå fjernet fra foreningen`,
          type: "success",
        });
        if (removedUser.id === user.id) {
          router.replace("/");
        }
      },
      update(cache, { data }) {
        if (!data) return;
        cache.evict({ id: cache.identify(data.removeMember.member) });
        cache.gc();
      },
      onError(error) {
        notify({ title: "Kunne ikke fjerne medlem", message: error.message, type: "error" });
      },
    }
  );

  return (
    <TableCell align="center">
      <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={menuAnchorEl} open={menuAnchorEl !== null} onClose={() => setMenuAnchorEl(null)}>
        {member.role === Role.Member && (
          <MenuItem
            disabled={!isAdmin || member.id === user.id}
            onClick={() => updateRole({ variables: { data: { memberId: member.id, role: Role.Admin } } })}
          >
            Gjør til administrator
          </MenuItem>
        )}
        {member.role === Role.Admin && (
          <MenuItem
            disabled={!isAdmin || member.user.id === user.id}
            onClick={() => updateRole({ variables: { data: { memberId: member.id, role: Role.Member } } })}
          >
            Fjern som administrator
          </MenuItem>
        )}
        {member.user.id === user.id && (
          <MenuItem onClick={() => removeMember({ variables: { data: { id: member.id } } })}>
            Forlat organisasjonen
          </MenuItem>
        )}
        {member.user.id !== user?.id && (
          <MenuItem disabled={!isAdmin} onClick={() => removeMember({ variables: { data: { id: member.id } } })}>
            Fjern fra organisasjonen
          </MenuItem>
        )}
      </Menu>
    </TableCell>
  );
}
