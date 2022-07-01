import { Box, Container, Typography } from "@mui/material";
import Breadcrumbs from "./Breadcrumbs";
import { TLink } from "./Breadcrumbs/types";

type Props = {
  title: string;
  breadcrumbs?: TLink[];
};

const Title: React.FC<Props> = ({ title, children, breadcrumbs }) => {
  return (
    <Box width={1} pt={5} position="relative" bgcolor="background.neutral" pb={children ? 0 : 6} mb={4}>
      <Container>
        {breadcrumbs && <Breadcrumbs sx={{ mb: { xs: 5, md: 8 } }} links={breadcrumbs} />}
        <Typography variant="h1" mb={4}>
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
};

export default Title;
