import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/qr/:token",
        destination: "https://ubuntu-server.tail1a982d.ts.net/qr/:token/view",
        permanent: false,
      },
      {
        source: "/batches/:id",
        destination: "https://ubuntu-server.tail1a982d.ts.net/admin/batches/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
