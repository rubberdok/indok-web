import { Container, Typography } from "@mui/material";
import { Logo } from "../../components";

const FooterSimple: React.FC = () => {
  return (
    <Container sx={{ textAlign: "center", py: 8 }}>
      <Logo sx={{ mb: 3 }} />
      <Typography variant="body3" sx={{ color: "text.secondary" }}>
        Kopirett © 2022 Foreningen for Studentene ved Indøk. Alle rettigheter reservert
      </Typography>
    </Container>
  );
};

export default FooterSimple;