const { dailyLogsService } = require('../services/dailyLogsService.js');
const { logger } = require('../utils/logger.js');
const { sendSuccess, sendError } = require('../utils/response.js');

const dailyLogsController = {

    newDailyLog : async (req, res, next)  => {
        const { date } = req.query;
        const { user_id } = req.user;

        // verifies date is a string object
        if (typeof date !== 'string') {
            logger.error('FAILED newDailyLog : date not valid input')
            return sendError(
                res,
                'Failed to create daily log, date needs to be of type date',
                'INVALID_FIELD_INPUT'
            )
        }

        try {
            const result = await dailyLogsService.newDailyLog({ user_id, date })

            if (!result) {
                logger.error('FAILED newDailyLog : not found ')
                return sendError(
                    res,
                    'Failed to create new daily log',
                    'NOT_FOUND',
                );
            }

            logger.info(`SUCCESS newDailyLog : created new daily_log`);
            return sendSuccess(
                res,
                `Created a new daily log for user`,
                result
            );
        } catch (err) {
            next(err);
        }
    },

    // Returns the days log_id based on date
    getDayLogId : async (req, res, next) => {
        const { user_id } = req.user;
        const { date } = req.query;

        if (typeof date !== 'string') {
            logger.error('FAILED getDayLogId : invalid date field')
            return sendError(
                res,
                'Failed to get log_id based on date',
                'INVALID_FIELD_INPUT'
            );
        }

        const result = await dailyLogsService.getDayLogId({ user_id, date });
        
        logger.info(`SUCCESS getDayLogId : got day's log`);
        return sendSuccess(
            res,
            `Retrieved days log_id based on date at ${date}`,
            result,
        );
    },

    getFoodData : async (req, res, next) => {
        const { log_id } = req.params;
        const { user_id } = req.user;
        
        if (typeof log_id !== 'string') {
            logger.error('FAILED getFoodData : invalid log_id provided')
            return sendError(
                res,
                'Invalid log_id provided',
                'INVALID_FIELD_INPUT'
            );
        }

        try {
            const result = await dailyLogsService.getFoodData({ user_id, log_id });

            if (!result) {
                logger.error('FAILED getFoodData : failed to get food data for log');
                return sendError(
                    res,
                    'Failed to get food data for log',
                    'NOT_FOUND',
                );
            }

            logger.info('SUCCESS getFoodData : retrieved food data for day');
            return sendSuccess(
                res,
                `Retrieved food dat for day at log_id`,
                result,
            );
        } catch (err) {
            next(err);
        }
    },

    
    getDayCalories : async (req, res, next) => {
        const { log_id } = req.params;
        const { user_id } = req.user;

        if (typeof log_id !== 'string') {
            logger.error('FAILED getDayCalories : invalid log_id provided')
            return sendError(
                res,
                'Invalid log_id provided',
                'INVALID_FIELD_INPUT'
            );
        }

        try {
            const result = await dailyLogsService.getDayCalories({ user_id, log_id });

            if(!result) {
                logger.error(`FAILED getDayCalories : could not get day calories`);
                return sendError(
                    res,
                    'Failed to get day calories for log_id',
                    'NOT_FOUND',
                );
            }

            logger.info(`SUCCESS getDayCalories : got day calories`);
            return sendSuccess(
                res,
                'Successfully got day calories',
                result
            );

        } catch (err) {
            next(err);
        }
    },

    deleteDailyLog : async (req, res, next) => {
        const { log_id } = req.params;
        const { user_id } = req.user;

        if (typeof log_id !== 'string') {
            logger.error('FAILED deleteDailyLog : invalid log_id provided')
            return sendError(
                res,
                'Invalid log_id provided',
                'INVALID_FIELD_INPUT'
            );
        }

        try {
            const result = await dailyLogsService.deleteDailyLog({ user_id, log_id });

            // verify result went through and found correct log
            if(!result) {
                logger.error('FAILED deleteDailyLog : failed to delete daily log');
                return sendError(
                    res,
                    'Failed to delete log',
                    'NOT_FOUND',
                );
            }

            logger.info(`SUCCESS deleteDailyLog : successfully deleted daily log`);
            return sendSuccess(
                res,
                `Log successfully deleted`,
            );

        } catch (err) {
            next(err);
        }
    }
}

module.exports = { 
    dailyLogsController,
}