/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}storage/:path*` // Proxy to Backend
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'divermaster.ru'
      },
      {
        protocol: 'https',
        hostname: 'divemaster.pro'
      },
      {
        protocol: 'https',
        hostname: 'api.divermaster.ru'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '10001'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '10002'
      }
    ]
  },
  sassOptions: {
    prependData: `
    @import 'src/styles/variables.scss';
    `
  }
}

export default nextConfig
