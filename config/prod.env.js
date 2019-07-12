var dotenv = require('dotenv').config()

module.exports = {
  NODE_ENV: '"production"',
  API_BASE_URL: `"${dotenv.parsed.API_BASE_URL}"`,
  API_BASE_WS_URL: `"${dotenv.parsed.API_BASE_WS_URL}"`
}
