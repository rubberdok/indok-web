import { Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Logo } from "../../components";

const FooterSimple: React.FC = () => {
  return (
    <Container sx={{ textAlign: "center", py: 8 }}>
      <Logo sx={{ mb: 3 }} />
      <Typography variant="body3" sx={{ color: "text.secondary" }}>
        {`Foreningen for Studentene ved Indøk © ${dayjs().format("YYYY")}`}
      </Typography>
    </Container>
  );
};

export default FooterSimple;
