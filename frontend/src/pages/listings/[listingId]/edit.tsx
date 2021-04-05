import { NextPage } from "next";
import Layout from "@components/Layout";
import { Container, Grid, ButtonGroup, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import ListingBody from "@components/pages/listings/detail/ListingBody";
import { useQuery } from "@apollo/client";
import { LISTING } from "@graphql/listings/queries";
import { useRouter } from "next/router";
import { Listing } from "@interfaces/listings";
import EditingListingBody from "@components/pages/listings/detail/EditListingBody";

const Edit: NextPage = () => {
  const { listingId } = useRouter().query;

  // fetches the listing, using the URL parameter as the argument
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { id: listingId },
  });
  
  const [editing, setEditing] = useState(true)
  const [content, setContent] = useState(data?.listing.description)
  
  useEffect(() => {
    setContent(data?.listing.description)
  }, [data?.listing.description]);

  const onChange = (event) => {
    setContent(event.target.value)
  }

  const save = (event) => {
    
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;


  return (
    <Layout>
      <Container>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid container item xs={10} direction="row" justify="space-between" style={{background: "white"}}>
            <Grid item>
              <ButtonGroup>
                <Button variant={editing ? "contained" : "outlined"} color={editing ? "primary" : "default"} onClick={(e) => setEditing(true)}>Rediger</Button>
                <Button variant={editing ? "outlined" : "contained"} color={editing ? "default" : "primary"} onClick={(e) => setEditing(false)}>Forhåndsvisning</Button>
              </ButtonGroup>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={save}>Lagre</Button>
            </Grid>
          </Grid>
          {data && (editing
            ? <EditingListingBody
                content={content || ""}
                onChange={onChange}
              />
            : <ListingBody 
                body={content || ""}
              />
            )
          }
        </Grid>
      </Container>
    </Layout>
  )
};


export default Edit;