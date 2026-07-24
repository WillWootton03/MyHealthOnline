const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { exercisesController } = require('../controllers/exercisesController.js');

const express = require('express');
const router = express.Router();

router
    .get('/', authMiddleware, exercisesController.getAllExercises)
    .get('/short', authMiddleware, exercisesController.shortGetAllExercises)
    .get('/custom', authMiddleware, exercisesController.customGetAllExercises)
    .post('/custom_exercise', authMiddleware, exercisesController.newCustomExercise)
    .put('/custom_exercise', authMiddleware, exercisesController.updateCustomExercise)
    .delete('/custom_exercise/:custom_exercise_id', authMiddleware, exercisesController.deleteCustomExercise)
    .get('/:exercise_id', authMiddleware, exercisesController.getExerciseById)  
;

module.exports = router