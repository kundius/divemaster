const fs = require('fs')
const path = require('path')

const root = __dirname
const tmpDir = path.join(root, 'tmp')

fs.mkdirSync(tmpDir, { recursive: true })

module.exports = {
  apps: [
    {
      name: 'api',
      cwd: path.join(root, 'api'),
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '2G',
      kill_timeout: 10000,
      time: true,
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
        APP_PORT: 3002,
        APP_HOST: '127.0.0.1',
        TMPDIR: tmpDir,
        PUPPETEER_EXECUTABLE_PATH: '/usr/bin/google-chrome-stable'
      }
    },
    {
      name: 'frontend',
      cwd: path.join(root, 'frontend'),
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001 -H 127.0.0.1',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '1G',
      kill_timeout: 10000,
      time: true,
      merge_logs: true,
      env: { NODE_ENV: 'production' }
    }
  ]
}
