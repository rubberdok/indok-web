import { Card, CardActionArea, CardContent, CardMedia, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

import { ArchiveByTypesQuery } from "@/generated/graphql";

type Props = {
  documents?: ArchiveByTypesQuery["archiveByTypes"];
};

export const DocumentList: React.FC<React.PropsWithChildren<Props>> = ({ documents }) => {
  if (!documents?.length) return <Typography> Fant ingen dokumenter som samsvarer med søket ditt </Typography>;

  return (
    <Grid
      container
      direction="row"
      spacing={4}
      justifyContent="flex-start"
      alignItems="stretch"
      sx={(theme) => ({ mb: theme.spacing(8) })}
    >
      {documents.map((doc) => (
        <Grid item md={3} xs={12} sm={6} key={doc.id}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea href={doc.webLink ?? ""} sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                image={doc.thumbnail ?? ""}
                height="150"
                sx={{
                  objectPosition: "top",
                }}
              />
              <CardContent>
                <Typography gutterBottom variant="subtitle2">
                  {doc.title}
                </Typography>
                <Typography variant="caption">
                  {doc.typeDoc
                    .replace(/_/g, " ")
                    .replace("ARBOKER", "ÅRBØKER")
                    .replace("STOTTE FRA HS", "STØTTE FRA HS")}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
