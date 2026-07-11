const { dailyLogsService } = require('../services/dailyLogsService.js');
const { mealItemsService } = require('../services/mealItemsService.js');
const { mealsService } = require('../services/mealsService.js');
const { logger } = require('../utils/logger.js');
const { sendError, sendSuccess } = require('../utils/response.js');

const mealItemsController = {
    
    newMealItem : async(req, res, next) => {
        
        const { user_id } = req.user;

        const { meal_id, log_id, meal_type, fdc_id, date, brand_owner, serving_size, food_name, 
                serving_amount, serving_unit, household_serving, macros} = req.body;


        // Verify all body elements present and valid types
        if(
            (meal_id && typeof meal_id !== 'string') || (log_id && typeof log_id !== 'string') || (meal_type && typeof meal_type !== 'string') 
            || (date && typeof date !== 'string') || typeof fdc_id !== 'string' || typeof brand_owner !== 'string' || typeof serving_size !== 'number' 
            || typeof food_name !== 'string' || typeof serving_amount !== 'number' || typeof serving_unit !== 'string' || typeof household_serving !== 'string' 
            || typeof macros !== 'object'
        ) {
            logger.error('FAILED newMealItem : invalid field inputs');
            return sendError(
                res,
                'Invalid field inputs',
                'INVALID_FIELD_INPUT'
            );
        }

        let new_log_id = undefined;
        let new_meal_id = undefined
        // Means no meal_id provided
        if (!meal_id) {
            // if no log_id provided then you first need to create a new log to create new meal
            if(!log_id) {
                new_log_id = await dailyLogsService.newDailyLog({ user_id, date });
                new_log_id = new_log_id.log_id;
            } else {
                new_log_id = log_id;
            }
            // Once getting log_id or creating new one, create new meal
            new_meal_id = await mealsService.newMeal({ user_id, log_id: new_log_id, meal_type });
            new_meal_id = new_meal_id.meal_id;
        } else {
            new_meal_id = meal_id;
        }

        // Verify meal_id and log_id created or set properly before continuing
        if (!new_meal_id) {
            logger.error('FAILED newMealItem : failed to create new meal');
            return sendError(
                res,
                'Failed to create new meal',
                'NOT_FOUND'
            );
        }

        try {    
            const result = await mealItemsService.newMealItem({ user_id, meal_id : new_meal_id, log_id : new_log_id, fdc_id, food_name, 
                                                                brand_owner, serving_size, serving_amount, serving_unit, household_serving, macros });

            if(!result)  {
                logger.error('FAILED newMealItem : failed to create new meal_item');
                return sendError(
                    res,
                    'Failed to create new meal item',
                    'NOT_FOUND OR UNAUTHORIZED'
                );
            }

            logger.info('SUCCESS newMealItem : successfully created new meal item');
            return sendSuccess(
                res,
                'Successfully created new meal item',
                result
            );

        } catch (err) {
            next(err);
        }
    },

    updateMealItem : async(req, res, next) => {
        const { user_id } = req.user;
        const { serving_unit, serving_amount, serving_size, household_serving, macros } = req.body;
        const { meal_item_id } = req.params;

        if(typeof serving_unit !== 'string' || typeof serving_amount !== 'number' || typeof macros !== 'object' || !meal_item_id
            || (serving_size && typeof serving_size !== 'number') || (household_serving && typeof household_serving !== 'string')
        ) {
            logger.error('FAILED updateMealitem : invalid field inputs');
            return sendError(
                res,
                'Failed to update meal item invalid field inputs',
                'INVALID_FIELD_INPUT'
            );
        }


        try {
            const result = await mealItemsService.updateMealItem({ user_id, meal_item_id, serving_unit, serving_amount, serving_size, household_serving, macros });

            if (!result) {
                logger.error('FAILED updateMealItem : not found or unauthorized');
                return sendError(
                    res,
                    'Failed to update item, not found or unauthorized',
                    'NOT_FOUND OR UNAUTHORIZED'
                );
            }

            logger.info(`SUCCESS updateMealItem : item successfully updated`);
            return sendSuccess(
                res,
                'Successfully updated meal item',
                result,
            );

        } catch (err) {
            next(err);
        }
    },

    deleteMealItem: async(req, res, next) => {
        const { user_id } = req.user;
        const { meal_item_id } = req.params;

        try {
            const result = await mealItemsService.deleteMealItem({ user_id, meal_item_id });

            if (!result) {
                logger.error('FAILED deleteMealItem : not found');
                return sendError(
                    res,
                    'Failed to delete meal item no found',
                    'NOT_FOUND'
                );
            }

            logger.info(`SUCCESS deleteMealItem : deleted meal item`);
            return sendSuccess(
                res,
                'Successfully deleted meal item',
            )
        } catch (err) {
            next(err);
        }
    },

}

module.exports = {
    mealItemsController,
}