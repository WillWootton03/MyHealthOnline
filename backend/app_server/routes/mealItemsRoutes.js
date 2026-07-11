const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { mealItemsController } = require('../controllers/mealItemsController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', authMiddleware, mealItemsController.newMealItem)
    .put('/:meal_item_id', authMiddleware, mealItemsController.updateMealItem)
    .delete('/:meal_item_id', authMiddleware, mealItemsController.deleteMealItem)
;

module.exports = router