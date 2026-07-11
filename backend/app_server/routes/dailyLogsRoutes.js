const { authMiddleware } = require('../../middleware/authMiddleware.js');
const { dailyLogsController } = require('../controllers/dailyLogsController.js');

const express = require('express');
const router = express.Router();

router
    .post('/', authMiddleware, dailyLogsController.newDailyLog)
    .get('/', authMiddleware, dailyLogsController.getDayLogId)
    .get('/:log_id/food_data', authMiddleware, dailyLogsController.getFoodData)
    .get('/:log_id/day_calories', authMiddleware, dailyLogsController.getDayCalories)
    .delete('/:log_id', authMiddleware, dailyLogsController.deleteDailyLog)
;

module.exports = router 