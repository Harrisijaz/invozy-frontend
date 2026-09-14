import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiImageRemotePattern = apiBaseUrl
  ? (() => {
      const url = new URL(apiBaseUrl);
      return {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: "/**",
      };
    })()
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(apiImageRemotePattern ? [apiImageRemotePattern] : []),
      {
        protocol: "https",
        hostname: "invorights.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.invorights.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
