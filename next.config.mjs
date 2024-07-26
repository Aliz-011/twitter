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

      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: `/a/${process.env.UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
  rewrites: () => {
    return [
      {
        source: '/hashtag/:tag',
        destination: '/search?q=%23:tag',
      },
    ];
  },
};

export default nextConfig;
