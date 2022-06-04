import { Box, Divider, Stack } from "@mui/material";
import { Logo } from "../../../components";

const HeaderSimple: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" py={4}>
      <Stack
        direction="row"
        alignItems="center"
        divider={<Divider orientation="vertical" sx={{ height: 24 }} />}
        spacing={3}
      >
        <Logo />
      </Stack>
    </Box>
  );
};

export default HeaderSimple;
