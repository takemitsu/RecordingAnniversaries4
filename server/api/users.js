import { Router } from 'express'
import User from '../models/user'

const router = Router()

/* GET users listing. */
router.get('/users', function (req, res, next) {
  if (req.decoded.admin) {
    User.find({}, function (err, users) {
      if (err) throw err
      res.json(users.map(user => {
        return serializeUser(user)
      }))
    })
  } else {
    User.find({
      _id: req.decoded.id
    }, function (err, users) {
      if (err) throw err
      res.json(users.map(user => {
        return serializeUser(user)
      }))
    })
  }
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

// PUT user by ID
router.put('/users/:id', function (req, res) {

  // TODO: validate

  User.findOne({
    _id: req.params.id
  }, function (err, user) {
    if (err) throw err

    console.log(req.body)

    if (req.body.username.length > 0) {
      user.name = req.body.username
    }

    if (req.body.password && req.body.password.length > 0) {
      user.password = req.body.password
    }

    console.log(user)

    user.save(function (err, updatedUser) {
      if (err) throw err
      console.log('User saved successfully: ' + updatedUser.name)

      res.json(serializeUser(updatedUser))
    })
  })
})

// Delete user by ID
router.delete('/users/:id', function (req, res) {
  User.findOne({
    _id: req.params.id
  }, function (err, user) {
    if (err) throw err

    user.remove(function (err) {
      if (err) throw err

      res.send({})
    })
  })
})

function serializeUser (user) {
  return {
    id: user._id,
    name: user.name
  }
}

export default router
