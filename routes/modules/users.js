const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.User

//register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const err_msg = []
  if (!name || !email || !password || !confirmPassword) {
    err_msg.push({ message: '請填寫所有欄位' })
  }
  if (password !== confirmPassword) {
    err_msg.push({ message: '確認密碼不相符' })
  }
  if (err_msg.length) {
    return res.render('register', { err_msg, name, email, password, confirmPassword })
  }

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      err_msg.push({ message: '此email已存在' })
      return res.render('register', {
        err_msg,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

//login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

//logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出！')
  res.redirect('/users/login')
})

module.exports = router