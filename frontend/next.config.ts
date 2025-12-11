import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:3000/api/v1/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://localhost:3000/uploads/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      // Untuk localhost:3000
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // Untuk localhost:9000 (yang Anda gunakan untuk gambar)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      // Alternatif untuk 127.0.0.1
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
    ],
    // Atau jika ingin lebih simple, gunakan domains:
    domains: ['localhost'],
  },
};

export default nextConfig;