export default () => ({
  // port: parseInt(process.env.PORT, 10) || 3000,
  // database: {
  //   host: process.env.DATABASE_HOST,
  //   port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  // }
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || '',
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '',
  LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH || '',
  DELIVERY_FREE_LIMIT: process.env.DELIVERY_FREE_LIMIT || 0,
  DELIVERY_COST: process.env.DELIVERY_COST || 0
})
