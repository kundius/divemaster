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
        protocol: 'https',
        hostname: 'musical-acorn-j7xwwrw79pfjpq-10001.app.github.dev'
      },
      {
        protocol: 'https',
        hostname: 'musical-acorn-j7xwwrw79pfjpq-10002.app.github.dev'
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
    @use 'src/styles/variables.scss' as *;
    `
  }
}

export default nextConfig
