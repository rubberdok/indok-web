import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import Breadcrumbs from "../../Breadcrumbs";
import { TLink } from "../../Breadcrumbs/types";

export type Props = {
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

const Title: React.FC<Props> = ({ title, children, breadcrumbs }) => {
  return (
    <RootStyle>
      <Box width={1} pt={5} position="relative" bgcolor="background.neutral" pb={children ? 0 : 6} mb={4}>
        <Container>
          {breadcrumbs && <Breadcrumbs sx={{ mb: { xs: 5, md: 8 } }} links={breadcrumbs} />}
          <Typography variant="h1" mb={4}>
            {title}
          </Typography>
          {children}
        </Container>
      </Box>
    </RootStyle>
  );
};

export default Title;
