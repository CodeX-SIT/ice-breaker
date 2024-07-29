/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
    missingSuspenseWithCSRBailout: true,
    taint: true,
  },
};

export default nextConfig;
