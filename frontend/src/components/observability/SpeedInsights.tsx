"use client";

import { SpeedInsights as VercelSpeedInsights } from "@vercel/speed-insights/next";

const DEFAULT_PRODUCTION_SAMPLE_RATE = 0.2;

const EXCLUDED_ROUTE_PREFIXES = ["/-/health", "/api/health", "/admin", "/admin-edit", "/cabins/admin", "/janhus/admin"];

function getProductionSampleRate() {
  const sampleRate = Number(process.env.NEXT_PUBLIC_SPEED_INSIGHTS_SAMPLE_RATE);

  if (!Number.isFinite(sampleRate)) {
    return DEFAULT_PRODUCTION_SAMPLE_RATE;
  }

  if (sampleRate <= 0 || sampleRate > 1) {
    return DEFAULT_PRODUCTION_SAMPLE_RATE;
  }

  return sampleRate;
}

function isExcludedRoute(url: string) {
  try {
    const pathname = new URL(url).pathname;
    return EXCLUDED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  } catch {
    return false;
  }
}

export function SpeedInsights() {
  if (process.env.NEXT_PUBLIC_APP_ENV !== "production") {
    return null;
  }

  return (
    <VercelSpeedInsights
      sampleRate={getProductionSampleRate()}
      beforeSend={(event) => {
        if (isExcludedRoute(event.url)) {
          return null;
        }

        return event;
      }}
      debug={false}
    />
  );
}
