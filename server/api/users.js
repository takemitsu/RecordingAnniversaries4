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
    id: user._id,
    name: user.name
  }
}

export default router
