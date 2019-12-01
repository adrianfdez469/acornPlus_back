const router = require('express').Router();

const rolController = require('./roleController');
const authController = require('../auth/authController');

router.post('/get', authController.IsAuthenticated, rolController.getRoles);

module.exports = router;