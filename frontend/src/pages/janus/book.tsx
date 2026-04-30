import { useRouter } from "next/router";
import { useEffect } from "react";

const JanusBookAliasRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/janhus/book");
  }, [router]);

  return null;
};

export default JanusBookAliasRedirectPage;
