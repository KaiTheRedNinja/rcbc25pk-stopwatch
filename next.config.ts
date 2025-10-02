import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/rcbc25pk-stopwatch",
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
};

export default nextConfig;
