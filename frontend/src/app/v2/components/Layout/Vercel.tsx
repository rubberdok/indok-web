import Image from "next/image";

import poweredByVercel from "~/public/powered-vercel.svg";

import { Link } from "../../../components/Link";

export const Vercel: React.FC = () => {
  return (
    <Link href="https://vercel.com/?utm_source=rubberdok&utm_campaign=oss" rel="noreferrer noopener" target="_blank">
      <Image src={poweredByVercel} alt="Powered by Vercel" style={{ height: "32px", width: "144px" }} />
    </Link>
  );
};
