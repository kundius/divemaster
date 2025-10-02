export default () => ({
  app: {
    url: process.env.APP_URL || '',
    origin: process.env.APP_ORIGIN || 'http://127.0.0.1:8080',
    port: process.env.APP_PORT || 4000,
    jwtSecretKey: process.env.JWT_SECRET_KEY || '',
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '30d',
    localStoragePath: process.env.LOCAL_STORAGE_PATH || 'uploads',
    localDataPath: process.env.LOCAL_DATA_PATH || 'data',
    emailAdmin: process.env.APP_EMAIL_ADMIN
  },
  delivery: {
    freeLimit: process.env.DELIVERY_FREE_LIMIT || 0,
    cost: process.env.DELIVERY_COST || 0
  },
  payment: {
    timeout: process.env.PAYMENT_TIMEOUT ? parseInt(process.env.PAYMENT_TIMEOUT) : 24
  },
  yookassa: {
    endpoint: process.env.PAYMENT_YOOKASSA_ENDPOINT || '',
    user: process.env.PAYMENT_YOOKASSA_USER || '',
    password: process.env.PAYMENT_YOOKASSA_PASSWORD || ''
  },
  vtb: {
    token_endpoint: process.env.PAYMENT_VTB_API_ENDPOINT || '',
    api_endpoint: process.env.PAYMENT_VTB_TOKEN_ENDPOINT || '',
    client_id: process.env.PAYMENT_VTB_CLIENT_ID || '',
    client_secret: process.env.PAYMENT_VTB_CLIENT_SECRET || ''
  },
  database: {
    host: process.env.DATABASE_HOST || 'db',
    port: process.env.DATABASE_PORT || '3306',
    name: process.env.DATABASE_NAME || 'divemaster',
    user: process.env.DATABASE_USER || 'divemaster',
    password: process.env.DATABASE_PASSWORD || 'divemaster'
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 25,
    secure: process.env.SMTP_SECURE === 'true'
  },
  typesense: {
    host: process.env.TYPESENSE_HOST || '127.0.0.1',
    port: process.env.TYPESENSE_PORT || '10004',
    protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    apiKey: process.env.TYPESENSE_API_KEY || 'xyz'
  }
})
