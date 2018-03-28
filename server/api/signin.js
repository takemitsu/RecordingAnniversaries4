import { Router } from 'express'
import User from '../models/user'
import jwt from 'jsonwebtoken'

// load .env
require('dotenv').config()

const router = Router()

router.post('/authenticate', function (req, res) {
  // find db by posted name
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) throw err

    // validation
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      })
      return
    }

    if (user.password !== req.body.password) {
      res.json({
        success: false,
        message: 'Authentication failed. Wrong password.'
      })
      return
    }

    const superSecret = process.env.SECRET

    // when valid -> create token
    const token = jwt.sign({
      id: user._id,
      name: user.name
    }, superSecret, {
      expiresIn: '24h'
    })

    res.json({
      success: true,
      message: 'Authentication successfully finished.',
      token: token
    })
  })
})

export default router
