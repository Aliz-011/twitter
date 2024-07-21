/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2'],
  },
  images: {
    remotePatterns: [
      {
        hostname: 'imageplaceholder.net',
      },
    ],
  },
};

export default nextConfig;
