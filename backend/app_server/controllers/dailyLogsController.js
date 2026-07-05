const { dailyLogsService } = require('../services/dailyLogsService.js');
const { logger } = require('../utils/logger.js');

const dailyLogsController = {

    newDailyLog : async (req, res, next)  => {
        const { date } = req.body;
        const  user_id  = req.user.user_id;  
        try {
            const result = await dailyLogsService.newDailyLog({ user_id, date })

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });

            logger.info(`Controller successfully created new daily_log`);
        } catch (err) {
            logger.error('Contoller failed to create new daily_log');
            next(err);
        }
    },

    getDayLogId : async (req, res, next) => {

        const user_id = req.user.user_id;
        const { date } = req.query;

        try {
            const result = await dailyLogsService.getDayLogId({ user_id, date });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });

                logger.info(`Controller successfully got day's log`);
            } catch (err) {
                logger.error(`Contoller failed to get day's log`);
                next(err);
        }
    },

    getFoodData : async (req, res, next) => {

        const { log_id } = req.params;

        if (!log_id) { return res.status(400).json({ success: false, error: "log_id not defined"});}

        try {
            const result = await dailyLogsService.getFoodData({ log_id });

            res
                .status(200)
                .json({
                    succes: true,
                    data: result    
                });
       logger.info('Controller Successfully retrieved food data for day');
        } catch (err) {
            logger.error('Contoller failed to retrieve food data for day');
            next(err);
        }
    },

    
    getDayCalories : async (req, res, next) => {

        const { log_id } = req.params;
        console.log(log_id)
        if (!log_id) { return res.status(400).json({ success: false, error: "log_id not defined"});}

        try {
            const result = await dailyLogsService.getDayCalories({ log_id });

            res
                .status(200)
                .json({
                    succes: true,
                    data: result    
                });
       logger.info('Controller Successfully retrieved calories for day');
        } catch (err) {
            logger.error('Contoller failed to retrieve calories for day');
            next(err);
        }
    },


}

module.exports = { 
    dailyLogsController,
}