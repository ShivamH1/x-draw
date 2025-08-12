/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile local workspace packages that ship uncompiled TS/TSX
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
