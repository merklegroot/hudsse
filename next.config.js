/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.devtool = 'cheap-module-source-map'
    }
    return config
  }
}

module.exports = nextConfig