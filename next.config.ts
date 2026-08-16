import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/qr/:token/view",
        destination: "https://ubuntu-server.tail1a982d.ts.net/qr/:token/view",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
