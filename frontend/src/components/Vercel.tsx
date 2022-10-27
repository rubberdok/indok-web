import { Link } from "@mui/material";
import Image from "next/future/image";
import NextLink from "next/link";

import poweredByVercel from "~/public/powered-vercel.svg";

export const Vercel: React.FC = () => {
  return (
    <NextLink href="https://vercel.com/?utm_source=rubberdok&utm_campaign=oss" rel="noreferrer noopener" passHref>
      <Link>
        <Image src={poweredByVercel} alt="Powered by Vercel" style={{ height: "32px", width: "144px" }} />
      </Link>
    </NextLink>
  );
};
