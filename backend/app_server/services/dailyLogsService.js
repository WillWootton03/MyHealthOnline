const { formatDate } = require('../../../shared/functions/formatting.ts');
const { dailyLogsRepo } = require('../repositories/dailyLogsRepo.js');
const { logger } = require('../utils/logger.js');
const { transporter } = require('../utils/nodemailer.js');

const crypto = require('crypto');

const dailyLogsService = {

    newDailyLog : async ({ user_id, date }) => {
        const log_id = crypto.randomUUID();
        const res = await dailyLogsRepo.newDailyLog({ user_id, log_id, date });
        return res;
    },

    // Attempts to find the daily_log for the day, if not found create a new daily log for that day
    // date must be string since its passed in queries, so should be already formatted
    getDayLogId : async ({ user_id, date }) => {
        const  res = await dailyLogsRepo.getDayLogId({ user_id, date });
        return res;
    },

    // 
    getFoodData : async ({ user_id, log_id }) => {
        const res = await dailyLogsRepo.getFoodData({ user_id, log_id });

        return res;
    },
    
    getDayCalories : async ({ user_id, log_id }) => {
        const res = await dailyLogsRepo.getDayCalories({ user_id, log_id });

        return res;
    },

    deleteDailyLog : async ({ user_id, log_id }) => {
        const res = await dailyLogsRepo.deleteDailyLog({ user_id, log_id });

        return res;
    }
}

module.exports = {
    dailyLogsService,
}