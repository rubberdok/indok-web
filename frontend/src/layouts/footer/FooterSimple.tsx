import { Container, Stack, Typography } from "@mui/material";

import { Vercel } from "@/components/Vercel";
import dayjs from "@/lib/date";

import { Logo } from "../../components";

export const FooterSimple: React.FC = () => {
  return (
    <Container sx={{ textAlign: "center", py: 8 }}>
      <Logo sx={{ mb: 3 }} />
      <Stack direction="column" gap={2} alignContent="center" justifyContent="center">
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Foreningen for Studentene ved Indøk © ${dayjs().format("YYYY")}
        </Typography>
        <Vercel />
      </Stack>
    </Container>
  );
};
