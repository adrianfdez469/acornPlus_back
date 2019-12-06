const express = require('express');

const router = express.Router();
const UserController = require('./userController');

router.post('/get', UserController.getUsers);
router.post('/add', UserController.addUser);


module.exports = router;