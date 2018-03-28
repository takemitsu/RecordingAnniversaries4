import { Router } from 'express'
import User from '../models/user'

const router = Router()

// setup(initialize)
router.get('/setup', function (req, res) {
  addUser({
    name: 'demouser',
    password: 'password',
    admin: true
  })
  addUser({
    name: 'takemitsu',
    password: 'password',
    admin: true
  })
  res.json({
    success: true
  })
})

function addUser (userData) {
  User.findOne({
    name: userData.name
  }, function (err, user) {
    if (err) throw err
    // validation
    if (!user) {
      const demo = new User({
        name: userData.name,
        password: userData.password,
        admin: userData.admin
      })
      demo.save(function (err) {
        if (err) throw err
        console.log('User saved successfully: ' + userData.name)
      })
    }
  })
}

export default router
