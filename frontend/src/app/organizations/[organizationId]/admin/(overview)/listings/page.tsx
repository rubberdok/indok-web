"use client";

import { useSuspenseQuery } from "@apollo/client";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { graphql } from "@/gql/app";
import dayjs from "@/lib/date";

export default function Page({ params }: { params: { organizationId: string } }) {
  const { organizationId } = params;

  const { data } = useSuspenseQuery(
    graphql(`
      query AdminOrganizationsPageListings($data: OrganizationInput!) {
        organization(data: $data) {
          organization {
            id
            listings {
              id
              name
              closesAt
            }
          }
        }
      }
    `),
    { variables: { data: { id: organizationId } } }
  );

  const { organization } = data.organization;
  const { listings } = organization;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Navn</TableCell>
            <TableCell>Deadline</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell>{listing.name}</TableCell>
              <TableCell>{dayjs(listing.closesAt).format("LLL")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
