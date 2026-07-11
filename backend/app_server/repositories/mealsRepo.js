const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

const mealsRepo = {
    newMeal : async ({ user_id, log_id, meal_id, meal_type}) => {
        try {
            // Conditional insert to verify user owns log
            // verify with WHERE EXISTS by pulling log_id from daily_logs, and verifying correct log_id and user_id that owns log match inputs
            const query = `
            INSERT INTO meals(meal_id, log_id, meal_type)
            SELECT $1, $2, $3
            WHERE EXISTS (
                SELECT 1
                FROM daily_logs d_l
                WHERE d_l.log_id = $2
                AND d_l.user_id = $4
            )
            AND NOT EXISTS (
                SELECT 1
                FROM meals m
                WHERE m.meal_type = $3
                    AND m.log_id = $2
            )
            RETURNING *
            `;
            
            const res = await pool.query(query, [meal_id, log_id, meal_type, user_id]);

            return res.rows[0] ?? null;
        } catch (err) {
            throw err;
        }
    },

}
module.exports = {
    mealsRepo,
}