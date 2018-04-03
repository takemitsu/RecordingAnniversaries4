import { Router } from 'express'
import Group from '../models/group'
import uuid from 'node-uuid'

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
      user_id: req.decoded.id,
      desc: req.body.desc
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

    if (req.body.name.length > 0) {
      group.name = req.body.name
    }
    group.desc = req.body.desc

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

// Add Anniv
router.post('/groups/:id', function (req, res) {
  // これに POST するのは anniv だけ、という前提

  Group.findOne({
    _id: req.params.id
  }, function (err, group) {
    if (err) throw err

    group.annivs.push({
      id: uuid.v4(),
      name: req.body.name,
      desc: req.body.desc,
      anniv_at: req.body.anniv_at
    })

    group.save(function (err, updatedGroup) {
      if (err) throw err
      console.log('User saved successfully: ' + updatedGroup.name)

      res.json(serializeGroup(updatedGroup))
    })
  })
})

// update anniv
router.put('/groups/:group_id/:anniv_id', function (req, res) {
  Group.findOne({
    _id: req.params.group_id
  }, function (err, group) {
    if (err) throw err

    let anniv = null
    group.annivs.forEach(function (tempAnniv) {
      console.log(tempAnniv._id.toString(), req.params.anniv_id)
      if (tempAnniv._id.toString() === req.params.anniv_id) {
        anniv = tempAnniv
      }
    })
    if (anniv === null) {
      res.status(401).json({
        success: false,
        message: 'anniv not found'
      })
      return
    }

    anniv.name = req.body.name
    anniv.desc = req.body.desc
    anniv.anniv_at = req.body.anniv_at

    group.save(function (err, updatedGroup) {
      if (err) throw err
      console.log('User saved successfully: ' + updatedGroup.name)

      res.json(serializeGroup(updatedGroup))
    })
  })
})

// delete anniv
router.delete('/groups/:group_id/:anniv_id', function (req, res) {
  Group.findOne({
    _id: req.params.group_id
  }, function (err, group) {
    if (err) throw err

    let index = null
    group.annivs.forEach(function (tempAnniv, tmpIndex) {
      console.log(tempAnniv._id.toString(), req.params.anniv_id)
      if (tempAnniv._id.toString() === req.params.anniv_id) {
        index = tmpIndex
      }
    })
    if (index === null) {
      res.status(401).json({
        success: false,
        message: 'anniv not found'
      })
      return
    }

    // 削除する
    group.annivs.splice(index, 1)

    group.save(function (err, updatedGroup) {
      if (err) throw err
      console.log('User saved successfully: ' + updatedGroup.name)

      res.json(serializeGroup(updatedGroup))
    })
  })
})

function serializeGroup (group) {
  return {
    id: group._id,
    name: group.name,
    desc: group.desc,
    annivs: group.annivs
  }
}

export default router
