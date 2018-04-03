import { Router } from 'express'
import jwt from 'jsonwebtoken'

import users from './users'
import signin from './signin'
// import setup from './setup'
import groups from './groups'

// load .env
require('dotenv').config()

const router = Router()

router.get('/', function (req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  res.send({
    ip: ip,
    url: fullUrl
  })
})

// setup(initialize)
// 初期設定時のみコメントを外して実行する
// router.use(setup)

// sign in
router.use(signin)

// authentification Filter
router.use(function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  // validate token
  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }

  const superSecret = process.env.SECRET
  jwt.verify(token, superSecret, function (err, decoded) {
    if (err) {
      return res.json({
        success: false,
        message: 'Invalid token'
      })
    }
    req.decoded = decoded
    next()
  })
})

router.use(groups)

// Add USERS Routes
router.use(users)

export default router
