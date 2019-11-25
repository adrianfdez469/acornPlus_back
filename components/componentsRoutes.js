const express = require('express');

const router = express.Router();

const securityRouter = require('./security/securityRouter');
const nomencladoresRouter = require('./nomencladores/nomencladoresRouter');
const AuthController = require('./security/auth/authController');

router.use('/security',securityRouter);
router.use('/nomencladores', AuthController.IsAuthenticated ,nomencladoresRouter);

module.exports = router;