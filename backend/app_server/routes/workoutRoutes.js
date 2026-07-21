const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { workoutController } = require('../controllers/workoutController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', authMiddleware, workoutController.newWorkout)
    .post('/custom_exercise', authMiddleware, workoutController.newCustomExercise)
    .put('/custom_exercise', authMiddleware, workoutController.updateCustomExercise)
    .delete('/custom_exercise/:custom_exercise_id', authMiddleware, workoutController.deleteCustomExercise)
;

module.exports = router