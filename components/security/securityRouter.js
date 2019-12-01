const express = require('express');
const router = express.Router();

const authRouter = require('./auth/authRouter');

const authController = require('./auth/authController');
const userRouter = require('./user/userRouter'); 
const rolRouter = require('./role/roleRouter');

router.use('/auth', authRouter);
router.use('/user', authController.IsAuthenticated, userRouter);
router.use('/rol', authController.IsAuthenticated, rolRouter);


module.exports = router;