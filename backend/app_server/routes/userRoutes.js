const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { userController } = require('../controllers/userController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', userController.createUser)
    .post('/login', userController.emailLogin)
    .get('/', authMiddleware, userController.getUser)
    .get('/daily_calories', authMiddleware, userController.getUserDailyCalories)
    .get('/send_verifyEmail', authMiddleware, userController.sendVerificationEmail)
    .get('/body_details', authMiddleware, userController.getUserBodyDetails)
    .put('/', authMiddleware, userController.updateUser)
    .put('/body_details', authMiddleware, userController.setBodyDetails)
    .put('/verifyEmail', userController.verifyEmail)
    .delete('/', authMiddleware, userController.deleteUser);
    ;

module.exports = router;