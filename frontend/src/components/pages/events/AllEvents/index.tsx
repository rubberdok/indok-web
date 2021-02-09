import { Button, Grid, Typography } from "@material-ui/core";
import Link from "next/link";
import React, { useState } from "react";
import { PlusSquare } from "react-feather";
import styled from "styled-components";
import FilterMenu from "./filterMenu";
import { useAllEventsQuery, useGetUserQuery } from "src/api/generated/graphql";

export interface FilterQuery {
  organization?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
}

const AllEvents: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [showTableView, setShowTableView] = useState(false);

  const { loading, error, data, refetch } = useAllEventsQuery({ variables: filters });
  const { loading: userLoading, error: userError, data: userData } = useGetUserQuery();

  if (loading) return <p>Loading...</p>;

  if (loading) return <Typography>Laster inn...</Typography>;

  if (error) return <Typography>Kunne ikke hente arrangementer.</Typography>;

  const onChange = (newFilters: FilterQuery) => {
    setFilters(newFilters);
    refetch(newFilters);
  };

  return (
    <>
      <Button
        style={{ paddingBottom: "0px", paddingTop: "0px", margin: "0px", fontSize: "1.1em" }}
        className={!showTableView ? "active" : ""}
        onClick={() => setShowTableView(!showTableView)}
      >
        Liste
      </Button>
      <Button
        style={{ paddingBottom: "0px", paddingTop: "0px", fontSize: "1.1em" }}
        className={showTableView ? "active" : ""}
        onClick={() => setShowTableView(!showTableView)}
      >
        Kalender
      </Button>

      <div style={{ float: "right" }}>
        {userData && !userLoading && userData.user && !userError && (
          <Link href="/events/create-event">
            <StyledIconButton>
              <PlusSquare />
              <p style={{ margin: 0 }}>Opprett</p>
            </StyledIconButton>
          </Link>
        )}
      </div>

      <Grid container>
        <Grid item xs={3}>
          <FilterMenu filters={filters} onChange={onChange} />
        </Grid>
        <Grid item xs>
          {showTableView ? (
            <p>{"Kommer snart! :)"}</p>
          ) : (
            <>
              {data?.allEvents?.length === 0 ? (
                <Typography variant="body1">Ingen arrangementer passer til valgte filtre.</Typography>
              ) : (
                data?.allEvents?.map(
                  (event) =>
                    event && (
                      <Link href={`/events/${event.id}`} key={event.id}>
                        <EventContainerLink style={{ color: "#000" }}>
                          <EventContainer
                            style={{
                              borderColor: event.organization?.color ?? "#fff",
                            }}
                          >
                            <p style={{ marginBottom: "0.2em" }}>{event.title}</p>
                            <p style={{ marginTop: 0 }}>Starttid: {event.startTime.slice(0, 19).replace("T", " ")}</p>
                          </EventContainer>
                        </EventContainerLink>
                      </Link>
                    )
                )
              )}
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AllEvents;

const StyledIconButton = styled.button`
  background: transparent;
  color: #000;
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
  border-color: #fff;
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
