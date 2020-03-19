const express = require('express');
const user = require('./controllers/userController');
const router = express.Router();

// users
router.get('/users', user.userIndex);
router.post('/add-users', user.addUser);
router.patch('/users/:id', user.editUser);
router.delete('/users/:id', user.deleteUser);

// user register and pass reset
router.post('/signup', user.signup);
router.post('/signin', user.signin);
router.post('/resetpass', user.resetPassword);
router.patch('/update-user-pass', user.updateUserPass);

module.exports = router;