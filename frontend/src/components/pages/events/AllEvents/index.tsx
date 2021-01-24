import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { GET_EVENTS } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import Link from "next/link";
import { PlusSquare } from "react-feather";
import styled from "styled-components";
import React, { useState } from "react";
import { NavItem } from "../../../navbar/NavbarLinks";
import color from "src/styles/theme";
import { DATAPORTEN_SCOPES, generateAuthURL } from "../../../navbar/utils";
import FilterMenu from "./filterMenu";

export interface FilterQuery {
  organization?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
}

const signInURL = generateAuthURL(
  process.env.NEXT_PUBLIC_DATAPORTEN_ID,
  process.env.NEXT_PUBLIC_DATAPORTEN_STATE,
  process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
  DATAPORTEN_SCOPES
);

const AllEvents: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [showTableView, setShowTableView] = useState(false);
  const { loading: userLoading, error: userError, data: userData } = useQuery<{ user: User }>(GET_USER);
  const { loading, error, data, refetch } = useQuery(GET_EVENTS, {
    variables: filters,
  });
  // should handle loading status
  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

  const onChange = (newFilters: FilterQuery) => {
    setFilters(newFilters);
    if (newFilters !== undefined) {
      refetch(newFilters);
    }
  };

  return (
    <div>
      <div>
        <NavItem
          style={{ paddingBottom: "0px", paddingTop: "0px", margin: "0px", fontSize: "1.1em" }}
          className={!showTableView ? "active" : ""}
          primary
          onClick={() => setShowTableView(!showTableView)}
        >
          Liste
        </NavItem>
        <NavItem
          style={{ paddingBottom: "0px", paddingTop: "0px", fontSize: "1.1em" }}
          className={showTableView ? "active" : ""}
          primary
          onClick={() => setShowTableView(!showTableView)}
        >
          Kalender
        </NavItem>

        <div style={{ float: "right" }}>
          {userData && !userLoading && userData.user && !userError && (
            // TODO: Redirect til `/events/create-event` når vi har funksjonalitet for dette.
            <Link href={`/events/create-event`}>
              <StyledIconButton>
                <PlusSquare />
                <p style={{ margin: 0 }}>Opprett</p>
              </StyledIconButton>
            </Link>
          )}
        </div>
      </div>

      <div style={{ width: "100%", paddingTop: "1em" }}>
        <div>
          <FilterMenu filters={filters} onChange={onChange} />
        </div>

        <div style={{ width: "70%", float: "right" }}>
          {showTableView ? (
            <p>{"Kommer snart! :)"}</p>
          ) : (
            <>
              {data.allEvents.length === 0 ? (
                <h4>{"Ingen arrangementer passer til valgte filtere"}</h4>
              ) : (
                data.allEvents.map((event: Event) => (
                  <Link href={`/events/${event.id}`} key={event.id}>
                    <EventContainerLink href={`/events/${event.id}`} style={{ color: "#000" }}>
                      <EventContainer
                        style={{
                          borderColor: event.organization?.color ?? color.colors.primaryLight,
                        }}
                      >
                        <p style={{ marginBottom: "0.2em" }}>{event.title}</p>
                        <p style={{ marginTop: 0 }}>Starttid: {event.startTime.slice(0, 19).replace("T", " ")}</p>
                      </EventContainer>
                    </EventContainerLink>
                  </Link>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllEvents;

const StyledIconButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-family: "Montserrat";
  font-size: 18px;
  border: none;
  display: flex;
  align-items: stretch;
  text-decoration: none !important;
  transition: 0.3s all ease;
  padding: 0;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    border: none;
    outline: none;
  }
`;

const EventContainer = styled.div`
  border: solid;
  border-width: 0.05em 0.05em 0.05em 1.2em;
  border-color: ${color.colors.primaryLight};
  border-radius: 0.2em;
  padding: 0.5em;
  margin-bottom: 0.5em;
  background-color: #fff;

  &:hover {
    cursor: pointer;
    background-color: #f4f4f4;
  }
`;

const EventContainerLink = styled.a`
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;
