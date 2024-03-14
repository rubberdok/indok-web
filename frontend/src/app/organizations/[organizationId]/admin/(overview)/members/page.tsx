"use client";

import { graphql } from "@/gql/app";
import { Role } from "@/gql/app/graphql";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { MoreVert } from "@mui/icons-material";
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
} from "@mui/material";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { organizationId: string } }) {
  const { organizationId } = params;

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
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Navn</TableCell>
            <TableCell>Rolle</TableCell>
            <TableCell></TableCell>
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
  const [removeMember] = useMutation(
    graphql(`
      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {
        removeMember(data: $data) {
          member {
            id
          }
        }
      }
    `),
    {
      optimisticResponse({ data: { id } }) {
        return {
          removeMember: {
            member: {
              id,
            },
          },
        };
      },
      onCompleted() {
        setMenuAnchorEl(null);
      },
      update(cache, { data }) {
        if (!data) return;
        cache.evict({ id: cache.identify(data.removeMember.member) });
      },
    }
  );

  return (
    <TableCell>
      <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={menuAnchorEl} open={menuAnchorEl !== null} onClose={() => setMenuAnchorEl(null)}>
        {member.role === Role.Member && <MenuItem disabled={!isAdmin}>Gjør til administrator</MenuItem>}
        {member.role === Role.Admin && (
          <MenuItem disabled={!isAdmin || member.user.id === user.id}>Fjern som administrator</MenuItem>
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
