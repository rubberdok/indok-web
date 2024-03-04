"use client";

import { useAlerts } from "@/app/components/Alerts";
import { getFragmentData, graphql } from "@/gql/app";
import { EventType, OrderPaymentStatus } from "@/gql/app/graphql";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Cancel, CheckCircle, MoreVert } from "@mui/icons-material";
import {
  Card,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

const SignUpFragment = graphql(`
  fragment OrganizationsAdminEventsSignUpsPage_SignUp on SignUp {
    id
    createdAt
    userProvidedInformation
    order {
      id
      paymentStatus
    }
    user {
      id
      firstName
      lastName
      gradeYear
      username
    }
  }
`);

export default function Page({ params }: { params: { organizationId: string; eventId: string } }) {
  const { eventId } = params;

  const { data } = useSuspenseQuery(
    graphql(`
      query OrganizationsAdminEventsSignUpsPage_EventQuery($data: EventInput!) {
        event(data: $data) {
          event {
            id
            type
            signUpsRequireUserProvidedInformation
            signUps {
              confirmed {
                total
                signUps {
                  ...OrganizationsAdminEventsSignUpsPage_SignUp
                }
              }
              waitList {
                total
                signUps {
                  ...OrganizationsAdminEventsSignUpsPage_SignUp
                }
              }
              retracted {
                total
                signUps {
                  ...OrganizationsAdminEventsSignUpsPage_SignUp
                }
              }
              removed {
                total
                signUps {
                  ...OrganizationsAdminEventsSignUpsPage_SignUp
                }
              }
            }
          }
        }
      }
    `),
    { variables: { data: { id: eventId } } }
  );

  const { event } = data.event;
  const confirmedSignUps = getFragmentData(SignUpFragment, event.signUps?.confirmed.signUps);
  const waitListSignUps = getFragmentData(SignUpFragment, event.signUps?.waitList.signUps);
  const retractedSignUps = getFragmentData(SignUpFragment, event.signUps?.retracted.signUps);
  const removedSignUps = getFragmentData(SignUpFragment, event.signUps?.removed.signUps);

  return (
    <Stack direction="column" spacing={3}>
      <Card sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500, minHeight: 300 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Navn</TableCell>
                <TableCell>Brukernavn (NTNU)</TableCell>
                <TableCell>E-post</TableCell>
                <TableCell>Telefonnummer</TableCell>
                <TableCell>Klasse</TableCell>
                <TableCell align="right">Påmeldingstidspunkt</TableCell>
                {event.type === EventType.Tickets && <TableCell align="center">Betaling</TableCell>}
                {event.signUpsRequireUserProvidedInformation && <TableCell>Informasjon fra brukeren</TableCell>}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {confirmedSignUps?.map((signUp) => (
                <TableRow key={signUp.id}>
                  <TableCell>
                    {signUp.user.firstName} {signUp.user.lastName}
                  </TableCell>
                  <TableCell>{signUp.user.username}</TableCell>
                  <TableCell>{signUp.user.firstName}</TableCell>
                  <TableCell>{signUp.user.lastName}</TableCell>
                  <TableCell>{signUp.user.gradeYear}. klasse</TableCell>
                  <TableCell align="right">{dayjs(signUp.createdAt).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                  {event.type === EventType.Tickets && (
                    <TableCell align="center">
                      {signUp.order?.paymentStatus === OrderPaymentStatus.Captured ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="warning" />
                      )}
                    </TableCell>
                  )}
                  {event.signUpsRequireUserProvidedInformation && (
                    <TableCell>{signUp.userProvidedInformation}</TableCell>
                  )}
                  <SignUpActionCell signUp={signUp} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500, minHeight: 300 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Navn</TableCell>
                <TableCell>Brukernavn (NTNU)</TableCell>
                <TableCell>E-post</TableCell>
                <TableCell>Telefonnummer</TableCell>
                <TableCell>Klasse</TableCell>
                <TableCell align="right">Påmeldingstidspunkt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {waitListSignUps?.map((signUp) => (
                <TableRow key={signUp.id}>
                  <TableCell>
                    {signUp.user.firstName} {signUp.user.lastName}
                  </TableCell>
                  <TableCell>{signUp.user.username}</TableCell>
                  <TableCell>{signUp.user.firstName}</TableCell>
                  <TableCell>{signUp.user.lastName}</TableCell>
                  <TableCell>{signUp.user.gradeYear}. klasse</TableCell>
                  <TableCell align="right">{dayjs(signUp.createdAt).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500, minHeight: 300 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Navn</TableCell>
                <TableCell>Brukernavn (NTNU)</TableCell>
                <TableCell>E-post</TableCell>
                <TableCell>Telefonnummer</TableCell>
                <TableCell>Klasse</TableCell>
                <TableCell align="right">Påmeldingstidspunkt</TableCell>
                <TableCell align="right">Avmeldingstidspunkt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {retractedSignUps?.map((signUp) => (
                <TableRow key={signUp.id}>
                  <TableCell>
                    {signUp.user.firstName} {signUp.user.lastName}
                  </TableCell>
                  <TableCell>{signUp.user.username}</TableCell>
                  <TableCell>{signUp.user.firstName}</TableCell>
                  <TableCell>{signUp.user.lastName}</TableCell>
                  <TableCell>{signUp.user.gradeYear}. klasse</TableCell>
                  <TableCell align="right">{dayjs(signUp.createdAt).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                  <TableCell align="right">{dayjs(signUp.createdAt).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500, minHeight: 300 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Navn</TableCell>
                <TableCell>Brukernavn (NTNU)</TableCell>
                <TableCell>E-post</TableCell>
                <TableCell>Telefonnummer</TableCell>
                <TableCell>Klasse</TableCell>
                <TableCell align="right">Påmeldingstidspunkt</TableCell>
                <TableCell align="right">Avmeldingstidspunkt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {removedSignUps?.map((signUp) => (
                <TableRow key={signUp.id}>
                  <TableCell>
                    {signUp.user.firstName} {signUp.user.lastName}
                  </TableCell>
                  <TableCell>{signUp.user.username}</TableCell>
                  <TableCell>{signUp.user.firstName}</TableCell>
                  <TableCell>{signUp.user.lastName}</TableCell>
                  <TableCell>{signUp.user.gradeYear}. klasse</TableCell>
                  <TableCell align="right">{dayjs(signUp.createdAt).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                  <TableCell align="right">{dayjs(signUp.createdAt).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
}

type SignUpActionProps = {
  signUp: {
    id: string;
  };
};

function SignUpActionCell({ signUp }: SignUpActionProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const { notify } = useAlerts();

  const [removeSignUp] = useMutation(
    graphql(`
      mutation OrganizationsAdminEventsSignUpsPage_RemoveSignUp($data: RemoveSignUpInput!) {
        removeSignUp(data: $data) {
          signUp {
            id
            participationStatus
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
        const { firstName, lastName } = data.removeSignUp.signUp.user;
        notify({ message: `${firstName} ${lastName} er nå meldt av arrangementet`, type: "success" });
      },
    }
  );
  return (
    <TableCell align="center">
      <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu open={menuOpen} anchorEl={menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
        <MenuItem onClick={() => removeSignUp({ variables: { data: { signUpId: signUp.id } } })}>
          Meld av arrangementet
        </MenuItem>
      </Menu>
    </TableCell>
  );
}
