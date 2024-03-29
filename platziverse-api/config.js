'use strict'

const debug = require('debug')('platziverse:api:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'dongnutla',
    password: process.env.DB_PASS || '1608',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
  },
  auth: {
    secret: process.env.SECRET || 'platzi'
  }
}