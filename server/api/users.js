import { Router } from 'express'
import User from '../models/user'

const router = Router()

/* GET users listing. */
router.get('/users', function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) throw err
    res.json(users.map(user => {
      return serializeUser(user)
    }))
  })
})

/* GET user by ID. */
router.get('/users/:id', function (req, res) {
  User.findOne({
    _id: req.params.id
  }, function (err, user) {
    if (err) throw err

    res.json(serializeUser(user))
  })
})

function serializeUser (user) {
  return {
    name: user.name
  }
}

router.get('/logout', function (req, res) {
  // console.log(req.decoded)
  // TODO: authenticate を 1秒 で更新する
  res.send({})
})

export default router
