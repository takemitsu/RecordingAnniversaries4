import { Router } from 'express'
import Group from '../models/group'

const router = Router()

/* GET groups listing. */
router.get('/groups', function (req, res, next) {
  Group.find({
    user_id: req.decoded.id
  }, function (err, groups) {
    if (err) throw err
    res.json(groups.map(group => {
      return serializeGroup(group)
    }))
  })
})

/* POST group */
router.post('/groups', function (req, res) {
  // TODO: Validator
  if (!req.body) {
    res.status(401).json({
      success: false,
      message: 'no body'
    })
    return
  }
  if ((!req.body.name) || req.body.name.length === 0) {
    res.status(401).json({
      success: false,
      message: 'name is required'
    })
    return
  }

  Group.findOne({
    name: req.body.name
  }, function (err, group) {
    if (err) throw err

    // validation
    if (group) {
      res.status(401).json({
        success: false,
        message: 'Registration failed. Group found.'
      })
      return
    }
    const newGroup = new Group({
      name: req.body.name,
      user_id: req.decoded.id
    })
    newGroup.save(function (err) {
      if (err) throw err
      console.log('User saved successfully: ' + newGroup.name)
    })

    res.json({
      success: true,
      message: 'Registration successfully finished.'
    })
  })
})

/* GET user by ID. */
router.get('/groups/:id', function (req, res) {
  Group.findOne({
    _id: req.params.id
  }, function (err, group) {
    if (err) throw err

    res.json(serializeGroup(group))
  })
})

// PUT user by ID
router.put('/groups/:id', function (req, res) {
  // TODO: validate
  if (!req.body) {
    res.status(401).json({
      success: false,
      message: 'no body'
    })
    return
  }
  if ((!req.body.name) || req.body.name.length === 0) {
    res.status(401).json({
      success: false,
      message: 'name is required'
    })
    return
  }

  Group.findOne({
    _id: req.params.id
  }, function (err, group) {
    if (err) throw err

    group.user_id = req.decoded.id
    if (req.body.name.length > 0) {
      group.name = req.body.name
    }

    group.save(function (err, updatedGroup) {
      if (err) throw err
      console.log('User saved successfully: ' + updatedGroup.name)

      res.json(serializeGroup(updatedGroup))
    })
  })
})

// Delete user by ID
router.delete('/groups/:id', function (req, res) {
  Group.findOne({
    _id: req.params.id
  }, function (err, user) {
    if (err) throw err

    user.remove(function (err) {
      if (err) throw err

      res.send({})
    })
  })
})

function serializeGroup (group) {
  return {
    id: group._id,
    name: group.name
  }
}

export default router
