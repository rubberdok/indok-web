import { Box, Container, Typography } from "@mui/material";

type Props = {
  children: string;
};

const Title: React.FC<Props> = ({ children }) => {
  return (
    <Box
      width={1}
      pt={10}
      pb={7}
      mb={4}
      position="relative"
      bgcolor="background.neutral"
      style={{ overflow: "hidden" }}
    >
      <Container>
        <Typography variant="h1" gutterBottom>
          {children}
        </Typography>
      </Container>
    </Box>
  );
};

export default Title;
