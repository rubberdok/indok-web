"use client";

import { graphql } from "@/gql/app";
import { useQuery, useSuspenseQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { NextLinkComposed } from "../components/Link";

const DocumentsPageQuery = graphql(`
  query DocumentsPage_Documents {
    documents {
      documents {
        id
        name
        description
        categories {
          id
          name
        }
        file {
          id
          url
        }
      }
    }
  }
`);

export default function Page() {
  const { data } = useSuspenseQuery(DocumentsPageQuery);

  useQuery(DocumentsPageQuery, {
    pollInterval: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <Grid container direction="row" spacing={2} alignItems="stretch">
      {data.documents.documents.map((document) => (
        <Grid md={3} xs={12} sm={6}>
          <Card sx={{ height: 1 }}>
            <CardActionArea
              sx={{ height: 1 }}
              component={NextLinkComposed}
              to={document.file.url ?? ""}
              target="_blank"
              disabled={!document.file.url}
            >
              <Stack direction="column" justifyContent="space-between" height={1}>
                <div>
                  {document.file.url && (
                    <CardMedia
                      sx={{
                        position: "relative",
                        height: 150,
                        borderRadius: (theme) => theme.shape.borderRadius,
                        m: (theme) => theme.spacing(1, 1, 0, 1),
                      }}
                    >
                      <Image
                        priority={false}
                        unoptimized
                        src={document.file.url}
                        alt=""
                        fill
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    </CardMedia>
                  )}
                  <CardHeader title={document.name} />
                  <CardContent>
                    <Typography>{document.description}</Typography>
                  </CardContent>
                </div>
                <div>
                  <CardContent>
                    <Grid container spacing={1} direction="row">
                      {document.categories.map((category) => (
                        <Grid>
                          <Chip key={category.id} label={category.name} />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </div>
              </Stack>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
