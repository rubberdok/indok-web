import Breadcrumbs from "@components/Breadcrumbs";
import { TLink } from "@components/Breadcrumbs/types";
import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";

type Props = {
  title: string;
  breadcrumbs: TLink[];
};

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const Admin: React.FC<Props> = ({ title, breadcrumbs }) => {
  return (
    <RootStyle>
      <Container>
        <Box sx={{ pt: 5, pb: 8 }}>
          <Breadcrumbs onDark sx={{ mb: 10 }} links={breadcrumbs} />
          <Typography variant="overline" color="grey.500">
            Administrer arrangement
          </Typography>
          <Typography variant="h2" component="h1">
            {title}
          </Typography>
        </Box>
      </Container>
    </RootStyle>
  );
};

export default Admin;
