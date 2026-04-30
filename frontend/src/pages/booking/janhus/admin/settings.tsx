import { useRouter } from "next/router";
import { useEffect } from "react";

const LegacyJanHusAdminSettingsRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/janhus/admin/settings");
  }, [router]);

  return null;
};

export default LegacyJanHusAdminSettingsRedirectPage;
