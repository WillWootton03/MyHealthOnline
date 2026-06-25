const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { userController } = require('../controllers/userController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', userController.createUser)
    .post('/login', userController.emailLogin)
    .get('/', authMiddleware, userController.getUser)
    .put('/', authMiddleware, userController.updateUser)
    .put('/body_details', authMiddleware, userController.setBodyDetails)
    .delete('/', authMiddleware, userController.deleteUser);
    ;

module.exports = router;