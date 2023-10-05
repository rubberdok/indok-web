import Image,{ StaticImageData } from "next/image";
import { Box, ButtonBase, Stack } from "@mui/material";
import { shadows } from "@/lib/mui/theme/shadows";

type Props = {
  name: string;
  image?: StaticImageData;
};
import cabin from "~/public/static/cabins/00.jpg";

export const ShopItem: React.VFC<Props> = ({name, image}) => {
  return (
    <Box sx={{
        border: "1.5px solid black",
        width: "30vw",
        height: "35vw",
        boxShadow: 24,
        borderRadius: 1,
    }}>
      <ButtonBase sx={{
        objectFit: "contain",
        height: "100%",
        width: "100%"
        }}>
          <Stack sx={{ alignItems: 'start'}}>
            <Box>
              {cabin && (
              <Image src={cabin} style={{ objectFit: "contain", width: "100%", height: "100%",} }/>
              )}
            </Box>
            <Box>{name}</Box>
          </Stack>
        </ButtonBase>
    </Box>
  );
};