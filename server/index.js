import express from 'express'
import { Nuxt, Builder } from 'nuxt'

import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import api from './api'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// load .env
require('dotenv').config()

// connect database
mongoose.connect(process.env.DB_HOST)

// application variables
app.set('superSecret', process.env.SECRET)

// config for body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// log request
app.use(morgan('dev'))

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
