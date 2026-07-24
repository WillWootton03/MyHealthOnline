const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { workoutController } = require('../controllers/workoutController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', authMiddleware, workoutController.newWorkout)
;

module.exports = router