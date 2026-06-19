import type { NextConfig } from "next";
import { getAndroidDevHost, isProductionAppEnv } from "./src/config/app-env";

const allowedDevOrigins = isProductionAppEnv() ? [] : [getAndroidDevHost(), "10.0.2.2"];
const configuredApiUrl = process.env.API_URL;

if (process.env.NODE_ENV === "production") {
  if (!configuredApiUrl) {
    throw new Error("API_URL must point to the deployed FitPulse backend for production builds.");
  }

  const apiUrl = new URL(configuredApiUrl);
  if (apiUrl.protocol !== "https:" || apiUrl.hostname.includes("your-fitpulse-backend")) {
    throw new Error("API_URL must be the real HTTPS production backend URL, not a placeholder.");
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins,
  async rewrites() {
    const apiUrl = (configuredApiUrl || "http://localhost:3001").replace(/\/+$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.exercisedb.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "qcywxceqsopfxpoukaxn.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
