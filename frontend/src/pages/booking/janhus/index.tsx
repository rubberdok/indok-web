import { useRouter } from "next/router";
import { useEffect } from "react";

const LegacyJanHusBookingRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/janhus/book");
  }, [router]);

  return null;
};

export default LegacyJanHusBookingRedirectPage;
