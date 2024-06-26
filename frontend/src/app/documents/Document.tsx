"use client";
import {
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
import { FragmentType, getFragmentData, graphql } from "@/gql/app";

const DocumentFragment = graphql(`
  fragment DocumentFragment on Document {
    file {
      id
      url
    }
    name
    description
    categories {
      id
      name
    }
  }
`);

type DocumentProps = {
  document: FragmentType<typeof DocumentFragment>;
  disabled?: boolean;
};

function Document(props: DocumentProps) {
  const document = getFragmentData(DocumentFragment, props.document);
  return (
    <Card
      sx={{
        height: 1,
        ...(!props.disabled && {
          ":hover": {
            transform: "scale(1.01)",
            transition: "transform 0.3s ease-in-out",
          },
        }),
      }}
    >
      <CardActionArea
        sx={{ height: 1 }}
        component={NextLinkComposed}
        to={document.file.url ?? ""}
        target="_blank"
        disabled={!document.file.url || props.disabled}
      >
        <Stack direction="column" justifyContent="space-between" height={1}>
          <div>
            {document.file.url && (
              <CardMedia
                sx={{
                  position: "relative",
                  height: 150,
                  overflow: "hidden",
                  borderRadius: 1,
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
            <CardContent
              title={document.description}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                lineClamp: 3,
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              <Typography overflow="hidden">{document.description}</Typography>
            </CardContent>
          </div>
          <div>
            <CardActions>
              <Grid container spacing={1} direction="row">
                {document.categories.map((category) => (
                  <Grid key={category.id}>
                    <Chip key={category.id} label={category.name} />
                  </Grid>
                ))}
              </Grid>
            </CardActions>
          </div>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

export { Document };
