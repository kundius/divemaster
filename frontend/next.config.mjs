/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080'
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
    ]
  },
  serverRuntimeConfig: {
    // secondSecret: process.env.SECRET
  },
  publicRuntimeConfig: {
    // apiUrl: process.env.API_URL,
    // localUrl: process.env.LOCAL_URL,
    // graphqlUrl: process.env.GRAPHQL_URL
  },
  sassOptions: {
    prependData: `
    @import 'src/styles/variables.scss';
    `
  }
}

export default nextConfig
