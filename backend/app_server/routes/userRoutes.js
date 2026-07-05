const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { userController } = require('../controllers/userController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', userController.createUser)
    .post('/login', userController.emailLogin)
    .get('/', authMiddleware, userController.getUser)
    .get('/daily_calories', authMiddleware, userController.getUserDailyCalories)
    .get('/send_verify_email', authMiddleware, userController.sendVerificationEmail)
    .put('/', authMiddleware, userController.updateUser)
    .put('/body_details', authMiddleware, userController.setBodyDetails)
    .put('/verify_email', userController.verify_email)
    .delete('/', authMiddleware, userController.deleteUser);
    ;

module.exports = router;