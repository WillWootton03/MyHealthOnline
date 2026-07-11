const { mealsService } = require('../services/mealsService.js');
const { logger } = require('../utils/logger.js');
const { sendError, sendSuccess } = require('../utils/response.js');

const mealsController = {

    newMeal : async (req, res, next) => {
        const { user_id } = req.user;
        try {
            const { log_id, meal_type } = req.body;
            if((!log_id || !meal_type) || (typeof log_id !== 'string' || typeof meal_type !== 'string')) {
                logger.error('FAILED newMeal : invalid field inputs');
                return sendError(
                    res,
                    'Invalid inputs for log_id and meal_type',
                    'INVALID_FIELD_INPUTS',
                );
            }

            const result = await mealsService.newMeal({ user_id, log_id, meal_type});

            if (!result) {
                logger.error("FAILED newMeal : not found or unauthorized");
                return sendError(
                    res,
                    'Failed to create new meal',
                    'NOT_FOUND OR UNAUTHORIZED'
                );
            }

            logger.info(`SUCCESS newMeal : created new meal`);
            return sendSuccess(
                res,
                'Successfully created new meal',
                result
            );
            
        } catch (err) {
            next(err);
        }
    },
}

module.exports = {
    mealsController,
}