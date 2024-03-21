/** @type {import('next').NextConfig} */
const nextConfig = {
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
