const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
  const match = req => {
    const owner = req.user._id
    const completed = req.query.completed === 'true'

    return req.query.completed ? { owner, completed } : { owner }
  }

  const sort = (sortBy => {
    if (sortBy) {
      const [field, order] = sortBy.split(':')
      return { [field]: order }
    }

    return {}
  })(req.query.sortBy)

  const limit = parseInt(req.query.limit)
  const skip = parseInt(req.query.skip)

  try {
    const tasks = await Task.find(match(req)).sort(sort).limit(limit).skip(skip)

    res.send(tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach(update => (task[update] = req.body[update]))
    await task.save()

    res.send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
