import { Container, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

import Vercel from "@components/Vercel";

import { Logo } from "../../components";

const FooterSimple: React.FC = () => {
  return (
    <Container sx={{ textAlign: "center", py: 8 }}>
      <Logo sx={{ mb: 3 }} />
      <Stack direction="column" gap={2} alignContent="center" justifyContent="center">
        <Typography variant="body3" sx={{ color: "text.secondary" }}>
          {`Foreningen for Studentene ved Indøk © ${dayjs().format("YYYY")}`}
        </Typography>
        <Vercel />
      </Stack>
    </Container>
  );
};

export default FooterSimple;
