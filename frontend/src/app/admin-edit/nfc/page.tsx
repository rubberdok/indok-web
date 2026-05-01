"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminEditNfcPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin-edit?mode=nfc");
  }, [router]);

  return null;
}
