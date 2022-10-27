import { FullscreenExitRounded, FullscreenRounded } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TableContainer,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { SignUpWithTicketFragment } from "@/generated/graphql";

import { AttendeeTable } from "./Table";

type Props = {
  attendees: SignUpWithTicketFragment[];
  tickets?: boolean;
  eventId: string;
};

export const Attendees: React.FC<Props> = (props) => {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      {fullscreen && (
        <Dialog open={fullscreen} onClose={() => setFullscreen(false)} fullScreen>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Påmeldte</Typography>
              <IconButton onClick={() => setFullscreen(false)}>
                <FullscreenExitRounded />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <TableContainer sx={{ height: "100%", width: "100%" }}>
              <AttendeeTable {...props} />
            </TableContainer>
          </DialogContent>
        </Dialog>
      )}
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title={
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="inherit">Påmeldte</Typography>
              <IconButton onClick={() => setFullscreen(true)}>
                <FullscreenRounded />
              </IconButton>
            </Stack>
          }
        />
        <CardContent>
          <TableContainer sx={{ height: 600, width: "100%" }}>
            <AttendeeTable {...props} />
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
};
