const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User

//create
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const name = req.body.name
  const UserId = req.user.id
  Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(err => res.send(err))
})

//read
router.get('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { UserId, id } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => res.send(err))
})

//update
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      res.render('edit', { todo: todo.toJSON() })
    })
    .catch(err => res.send(err))
})

router.put('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body

  Todo.findOne({ where: { userId, id } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => res.send(err))
})

module.exports = router