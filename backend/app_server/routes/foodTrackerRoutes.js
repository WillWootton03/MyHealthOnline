const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { foodTrackerController } = require('../controllers/foodTrackerController.js');

const express = require('express');
const router = express.Router();

router
    .get('/get_one', authMiddleware, foodTrackerController.searchSingleItem)
    .get('/get_all', authMiddleware, foodTrackerController.searchAllItems)
    .get('/:fdcId', authMiddleware, foodTrackerController.getSingleItemById)
;

module.exports = router;