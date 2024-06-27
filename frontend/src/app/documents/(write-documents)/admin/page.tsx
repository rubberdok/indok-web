"use client";
import { NextLinkComposed } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Add, Delete, Download, Edit, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const { data } = useSuspenseQuery(
    graphql(`
      query DocumentsAdmin_Page {
        documents {
          documents {
            id
            name
            file {
              id
              url
              name
            }
            createdAt
            updatedAt
            description
            categories {
              id
              name
            }
            ...DocumentListItemFragment
          }
        }
      }
    `)
  );

  const [deleteDocument] = useMutation(
    graphql(`
      mutation DocumentsAdminPage_DeleteDocument($data: DeleteDocumentInput!) {
        deleteDocument(data: $data) {
          document {
            id
          }
        }
      }
    `),
    {
      update(cache, { data }) {
        if (data?.deleteDocument.document) {
          cache.evict({ id: cache.identify(data.deleteDocument.document) });
          cache.gc();
        }
      },
    }
  );

  return (
    <Stack direction="column">
      <List>
        <ListItem>
          <ListItemButton component={NextLinkComposed} to="/documents/new">
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Legg til nytt dokument" />
          </ListItemButton>
        </ListItem>
        {data.documents.documents.map((document) => (
          <DocumentListItem
            key={document.id}
            document={document}
            onDelete={() => deleteDocument({ variables: { data: { id: document.id } } })}
          />
        ))}
      </List>
    </Stack>
  );
}

const DocumentListItemFragment = graphql(`
  fragment DocumentListItemFragment on Document {
    id
    name
    file {
      id
      url
    }
    updatedAt
  }
`);

type DocumentListItemProps = {
  onDelete: () => void;
  document: FragmentType<typeof DocumentListItemFragment>;
};

function DocumentListItem(props: DocumentListItemProps) {
  const document = getFragmentData(DocumentListItemFragment, props.document);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton aria-label="Flere valg" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>{document.file.url && <Image src={document.file.url} alt={document.name} unoptimized fill />}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={document.name} secondary={<>Sist endret {dayjs(document.updatedAt).format("LLL")}</>} />
      </ListItem>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {document.file.url && (
          <MenuItem component="a" href={document.file.url} target="_blank" download>
            <ListItemIcon>
              <Download />
            </ListItemIcon>
            <ListItemText primary="Last ned" />
          </MenuItem>
        )}
        <MenuItem component={NextLinkComposed} to={`/documents/edit/${document.id}`}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Rediger" />
        </MenuItem>
        <MenuItem onClick={() => props.onDelete()}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText primary="Slett" />
        </MenuItem>
      </Menu>
    </>
  );
}
