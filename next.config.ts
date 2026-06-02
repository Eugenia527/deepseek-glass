import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/deepseek-glass",
  images: { unoptimized: true },
};

export default nextConfig;
