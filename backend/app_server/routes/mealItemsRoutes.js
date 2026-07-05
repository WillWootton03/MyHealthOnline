const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { mealItemsController } = require('../controllers/mealItemsController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', authMiddleware, mealItemsController.newMealItem)
    .put('/', authMiddleware, mealItemsController.updateMealItem)
    .delete('/', authMiddleware, mealItemsController.deleteMealItem)
;

module.exports = router