import { useRouter } from "next/router";
import { useEffect } from "react";

const LegacyJanHusAdminRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/janhus/admin");
  }, [router]);

  return null;
};

export default LegacyJanHusAdminRedirectPage;
