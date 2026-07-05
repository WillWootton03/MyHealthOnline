const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

const mealsRepo = {
    newMeal : async ({ meal_id, log_id, meal_type}) => {
        try {
            const query = `
            INSERT INTO meals(meal_id, log_id, meal_type)
            VALUES ($1, $2, $3)
            RETURNING *
            `;
            
            const res = await pool.query(query, [meal_id, log_id, meal_type]);

            logger.info(`Inserted new meal at ${meal_id}`);
            return res.rows[0];
        } catch (err) {
            console.error(`Failed to create meal for daily_log : ${err}`);
            logger.error(`Failed to create meal for daily_log : ${err}`);

            throw err;
        }
    },
}
module.exports = {
    mealsRepo,
}