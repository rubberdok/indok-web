import { Box, Button, Divider, Stack } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Logo } from "../../components";

const HeaderSimple: React.FC = () => {
  const router = useRouter();

  return (
    <Box display="flex" justifyContent="center" py={4}>
      <Stack
        direction="row"
        alignItems="center"
        divider={<Divider orientation="vertical" sx={{ height: 24 }} />}
        spacing={3}
      >
        <Button onClick={() => router.back()} color="inherit" variant="outlined">
          Gå tilbake
        </Button>

        <Logo />

        <NextLink href="/about/board" passHref>
          <Button color="inherit" variant="outlined">
            Kontakt
          </Button>
        </NextLink>
      </Stack>
    </Box>
  );
};

export default HeaderSimple;
