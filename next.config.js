/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/twilio/:path*',
        destination: 'http://localhost:45372/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
