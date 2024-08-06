/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
    missingSuspenseWithCSRBailout: true,
    taint: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
