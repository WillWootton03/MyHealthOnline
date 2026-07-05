const { dailyLogsService } = require('../services/dailyLogsService.js');
const { mealItemsService } = require('../services/mealItemsService.js');
const { mealsService } = require('../services/mealsService.js');
const { logger } = require('../utils/logger.js');

const mealItemsController = {
    
    newMealItem : async(req, res, next) => {
        const { meal_id = undefined, log_id = undefined, meal_type, fdc_id, brand_owner, serving_size, food_name, 
                serving_amount, serving_unit, household_serving, macros, per_100 } = req.body;

        let new_log_id = undefined;
        if(log_id === undefined) {
             new_log_id = await dailyLogsService.newDailyLog({ user_id });
        } else {
            new_log_id = log_id;
        }

        let new_meal_id = undefined
        if (meal_id === undefined) {
            new_meal_id = await mealsService.newMeal({ log_id: new_log_id, meal_type });
            new_meal_id = new_meal_id.meal_id;
        } else {
            new_meal_id = meal_id;
        }

        try {    
            const result = await mealItemsService.newMealItem({ meal_id: new_meal_id, fdc_id, food_name, brand_owner, serving_size, 
                                                                serving_amount, serving_unit, household_serving, macros, per_100 });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });

                logger.info(`Controller successfully created new meal_item`);
            } catch (err) {
                logger.error('Contoller failed to create new meal_item');
                next(err);
        }
    },

    updateMealItem : async(req, res, next) => {
        const { serving_type, serving_amount, macros } = req.body;

        const meal_item_id = req.query.meal_item_id;

        try {
            const result = await mealItemsService.updateMealItem({ meal_item_id, serving_type, serving_amount, macros });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });

            logger.info(`Controller successfully updated meal_item`);
        } catch (err) {
            logger.error('Contoller failed to update meal_item');
            next(err);
        }
    },

    deleteMealItem: async(req, res, next) => {
        const meal_item_id = req.query.meal_item_id;

        try {
            const result = await mealItemsService.deleteMealItem({ meal_item_id });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                })

            logger.info(`Controller successfully delete meal_item`);
        } catch (err) {
            logger.error('Contoller failed to delete meal_item');
            next(err);
        }
    },

}

module.exports = {
    mealItemsController,
}