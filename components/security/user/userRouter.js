const express = require('express');

const router = express.Router();
const UserController = require('./userController');

router.post('/get', UserController.getUsers);


module.exports = router;