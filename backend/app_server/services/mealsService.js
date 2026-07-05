const { mealsRepo } = require('../repositories/mealsRepo.js');
const { logger } = require('../utils/logger.js');
const { transporter } = require('../utils/nodemailer.js');

const crypto = require('crypto');

const mealsService = {
    newMeal : async ({ log_id, meal_type }) => {
        const meal_id = crypto.randomUUID();

        const res = await mealsRepo.newMeal({ meal_id, log_id, meal_type});

        return res;
    },
}

module.exports = {
    mealsService,
}