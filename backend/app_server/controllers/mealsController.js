const { mealsService } = require('../services/mealsService.js');
const { logger } = require('../utils/logger.js');

const mealsController = {
    newMeal : async (req, res, next) => {
        const { log_id, meal_type } = req.body;
        try {
            const result = await mealsService.newMeal({ log_id, meal_type });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });

            logger.info(`Controller successfully created new meal`);
        } catch (err) {
            logger.error('Contoller failed to create new meal');
            next(err);
        }
    },
}

module.exports = {
    mealsController,
}