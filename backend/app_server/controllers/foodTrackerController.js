const { foodTrackerService } = require('../services/foodTrackerService.js');
const { logger } = require('../utils/logger.js');



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

        if (!food_name) {
            return res.status(400).json({ success: false, error: "food_name not defined"});
        }

        if (!user) {
            logger.error('Invalid user trying to access food resources');
            return res.status(400).json({ success: false, error: "user not allowed to access resources"});
        }

        try {
            const result = await foodTrackerService.searchSingleItem({ food_name });

            res
                .status(200)    
                .json({
                    success: true,
                    data: result,
                })
            logger.info('Controller Successfully retrieved an item from food database');
        } catch (err) {
            logger.error('Contoller failed to retrieve an item from food database');
            next(err);
        }
    },

    getSingleItemById : async (req, res, next) => {
        const user = req.user?.user_id;

        const { fdcId } = req.params;
        
        if (!user) {
            logger.error('Invalid user trying to access food resources');
            return res.status(400).json({ success: false, error: "user not allowed to access resources"});
        }

        try {
            const result = await foodTrackerService.getSingleItemById({ fdcId });

            res
                .status(200)
                .json({
                    succes: true,
                    data: result
                });

         logger.info('Controller Successfully retrieved food item by id');
        } catch (err) {
            logger.error('Contoller failed to retrieve food item by id');
            next(err);
        }
    },

    searchAllItems : async (req, res, next) => {
        const user = req.user?.user_id;
        const { food_name, page_number } = req.query;

        if (!food_name) {
            return res.status(400).json({ success: false, error: "food_name not defined"});
        }

        if (!user) {
            logger.error('Invalid user trying to access food resources');
            return res.status(400).json({ success: false, error: "user not allowed to access resources"});
        }

        try {
            const result = await foodTrackerService.searchAllItems({ food_name, page_number });

            res
                .status(200) 
                .json({
                    success: true,
                    data: result,
                })

            logger.info('Controller Successfully retrieved all items from food database');
        } catch (err) {
            logger.error('Contoller failed to retrieve all items from food database');
            next(err);
        }

    }
    
}

module.exports = { foodTrackerController };