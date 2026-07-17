const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { exercisesController } = require('../controllers/exercisesController.js');

const express = require('express');
const router = express.Router();

router
    .get('/', authMiddleware, exercisesController.getAllExercises)
    .get('/short', authMiddleware, exercisesController.shortGetAllExercises)
    .get('/:exercise_id', authMiddleware, exercisesController.getExerciseById)  
;

module.exports = router