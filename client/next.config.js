 /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/books/page=1',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
