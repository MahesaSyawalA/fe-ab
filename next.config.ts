import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=(self)",
  },
];

const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // UJI INTERNAL SAJA (Vercel): browser memanggil /backend/* di domain FE, lalu diteruskan ke BE.
  // Satu domain => cookie sameSite=lax tetap jalan. /api/auth/* dipakai NextAuth, jadi prefix harus /backend.
  // Hanya aktif bila BACKEND_URL diset (mis. https://be-xxx.vercel.app); lokal/Docker tidak terpengaruh.
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return [];
    return [{ source: "/backend/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

export default nextConfig as NextConfig;
