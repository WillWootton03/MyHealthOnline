const { mealsRepo } = require('../repositories/mealsRepo.js');
const { logger } = require('../utils/logger.js');
const { transporter } = require('../utils/nodemailer.js');

const crypto = require('crypto');

const mealsService = {
    newMeal : async ({ user_id, log_id, meal_type = 'breakfast' }) => {
        const meal_id = crypto.randomUUID();
        const res = await mealsRepo.newMeal({ user_id, log_id, meal_id, meal_type});

        return res;
    },
}

module.exports = {
    mealsService,
}