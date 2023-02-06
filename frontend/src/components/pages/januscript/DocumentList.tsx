import { Card, CardActionArea, CardContent, CardMedia, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

import { AllJanuscriptQuery } from "@/generated/graphql";

type Props = {
  documents?: AllJanuscriptQuery["allJanuscript"];
};

export const DocumentList: React.FC<Props> = ({ documents }) => {
  if (!documents?.length) return <Typography> Fant ingen dokumenter som samsvarer med søket ditt </Typography>;

  return (
    <Grid
      container
      direction="row"
      spacing={4}
      justifyContent="center"
      alignItems="stretch"
      sx={(theme) => ({ mb: theme.spacing(8) })}
    >
      {documents.map((doc, i) => (
        <Grid item md={3} xs={12} sm={6} key={i}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea href={doc.webLink ?? ""} sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                image={doc.thumbnail}
                height="150"
                sx={{
                  objectPosition: "top",
                }}
              />
              <CardContent>
                <Typography gutterBottom variant="subtitle2">
                  {doc.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
