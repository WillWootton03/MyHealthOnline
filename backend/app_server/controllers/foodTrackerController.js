const { foodTrackerService } = require('../services/foodTrackerService.js');
const { logger } = require('../utils/logger.js');
const { sendError, sendSuccess } = require('../utils/response.js');



const foodTrackerController = {
    /*
    *
    *
    * GET METHODS
    * 
    * 
    */

    searchSingleItem : async (req, res, next) => {
        const user = req.user?.user_id;

        const { food_name } = req.query;

        if (typeof food_name !== 'string') {
            logger.error('FAILED getFoodData : invalid food_name provided')
            return sendError(
                res,
                'Invalid food_name',
                'INVALID_FIELD_INPUT'
            );
        }

        try {
            const result = await foodTrackerService.searchSingleItem({ food_name });

            if(!result) {
                logger.error('FAILED searchSingleItem : did not find single item');
                return sendError(
                    res,
                    'Failed to retrieve single item',
                    'NOT_FOUND'
                );
            }

            logger.info('SUCCESS searchSingleItem : retrieved an item from food database');
            return sendSuccess(
                res,
                'Successfully found food item based on food_name',
                result
            )
        } catch (err) {
            next(err);
        }
    },

    getSingleItemById : async (req, res, next) => {
        const { fdcId } = req.params;
    
        if(typeof fdcId !== 'string') {
            logger.error('FAILED getSingleItemById : invalid field input');
            return sendError(
                res,
                'Invalid field inputs given for fdcId',
                'INVALID_FIELD_INPUT'   
            );
        }

        try {
            const result = await foodTrackerService.getSingleItemById({ fdcId });

            if (!result) {
                logger.error('FAILED getSingleItemById : no item found with that fdcId');
                return sendError(
                    res,
                    'No item found with fdcId',
                    'NOT_FOUND',
                );
            }

            logger.info('SUCCESS getSingleItemById : retrieved food item by id');
            return sendSuccess(
                res,
                'Successfully retrieved item by id',
                result
            );  

        } catch (err) {
            next(err);
        }
    },

    searchAllItems : async (req, res, next) => {
        const { food_name, page_number } = req.query;

        if (typeof food_name !== 'string' && typeof page_number !== 'number') {
            logger.error('FAILED searchAllItems : invalid field inputs');
            return sendError(
                res,
                'Failed to search items, invalid inputs',
                'INVALID_FIELD_INPUTS',
            );
        }

        try {
            const result = await foodTrackerService.searchAllItems({ food_name, page_number });

            if (!result) {
                logger.error('FAILED searchAllItems : no items returned');
                return sendError(
                    res,
                    'No item returned from search',
                    'NOT_FOUND',
                );
            }

            logger.info('SUCCESS searchAllItems : retrieved food items by search');
            return sendSuccess(
                res,
                'Successfully retrieved food items by search',
                result
            );  

        } catch (err) {
            next(err);
        }
    },
    
}

module.exports = { foodTrackerController };