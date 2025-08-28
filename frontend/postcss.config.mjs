/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['./src/app/custom-media.css']
    },
    'postcss-nested': {},
    'postcss-custom-media': {},
    '@tailwindcss/postcss': {},
  }
}

export default config
