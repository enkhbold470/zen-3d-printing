import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placekeanu.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.thingiverse.com",
      },
      {
        protocol: "https",
        hostname: "scontent-sjc3-1.xx.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
    },
    {
      protocol: "https",
      hostname: "randomuser.me",
    },
  ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
