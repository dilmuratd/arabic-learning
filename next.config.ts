import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/arabic-learning",
  assetPrefix: "/arabic-learning",
};

export default nextConfig;
