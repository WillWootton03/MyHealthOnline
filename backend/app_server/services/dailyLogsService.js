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

    // Attempts to find the daily_log for the day, if not found create a new daily log for that da
    getDayLogId : async ({ user_id, date }) => {
        let res = await dailyLogsRepo.getDayLogId({ user_id, date });
        return res;
    },

    // 
    getFoodData : async ({ log_id }) => {
        const res = await dailyLogsRepo.getFoodData({ log_id });

        return res;
    },
    
    getDayCalories : async ({ log_id }) => {
        const res = await dailyLogsRepo.getDayCalories({ log_id });

        return res;
    },
}

module.exports = {
    dailyLogsService,
}