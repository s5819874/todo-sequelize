const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  User.findByPk(UserId)
    .then(user => {
      return Todo.findOne({ UserId, id })
    })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => res.send(err))
})

module.exports = router