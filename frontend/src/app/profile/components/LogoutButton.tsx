"use client";

import { Button } from "@mui/material";

import { NextLinkComposed } from "@/app/components/Link";
import { config } from "@/utils/config";

export function LogoutButton() {
  return (
    <Button component={NextLinkComposed} to={new URL("/auth/logout", config.API_URL)} color="error" variant="contained">
      Logg ut
    </Button>
  );
}
