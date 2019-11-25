const express = require('express');
const authController = require('./authController');
const roleController = require('../role/roleController');


const router = express.Router();

router.post('/login', authController.Login);
router.get('/actions', authController.IsAuthenticated, roleController.getActionsFromUser);

module.exports = router;
