const express = require('express');
const router = express.Router();

const authRouter = require('./auth/authRouter');

router.use('/auth', authRouter);

module.exports = router;