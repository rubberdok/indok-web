"use client";

import { useEffect } from "react";

function Pizza() {
  useEffect(() => {
    window.location.href = "https://pizzapicker.vercel.app/";
  }, []);

  return null;
}

export default Pizza;
