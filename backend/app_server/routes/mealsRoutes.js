const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { mealsController } = require('../controllers/mealsController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', authMiddleware, mealsController.newMeal)
;

module.exports = router