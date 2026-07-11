const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

const dailyLogsRepo = {

    newDailyLog : async ({ user_id, log_id, date }) => {
        try {
            // prevents daily_logs from the same day to be added when the user already has a log for that day
            const query = `
            INSERT INTO daily_logs(log_id, user_id, date)
            SELECT $1, $2, $3
            WHERE NOT EXISTS(
                SELECT 1
                FROM daily_logs d_l
                WHERE d_l.date = $3
                    AND d_l.user_id = $2
            )
            RETURNING *
            `;
            const res = await pool.query(query, [log_id, user_id, date])

            return res.rows[0] ?? null;

        }catch (err) {
            throw err;
        }
    },
    
/*
*
*
* GET METHODS
*
*
*/
    /*
        GET : returns the daily_log id for a user based on user_id and the date provided
    */
    getDayLogId : async ({ user_id, date }) => {
        try {
            const query = `
            SELECT d_l.log_id
            FROM daily_logs d_l
            WHERE d_l.user_id = $1 AND d_l.date = $2
            `;

            const res = await pool.query(query, [user_id, date])
            
            return res.rows[0] ?? null;

        } catch (err) {
            throw err;
        }
    },

    /*
        GET : returns all meal_id's for all meals logged for a day along with meal type, and all meal_items and data for each meal item based on meal_id and log_id
    */
    getFoodData : async ({ user_id, log_id }) => {
        try{
            /*
                QUERY EXPLANATION
                get meal_id, meal_type and items.
                - set items to be a key value pair where meal_item_id is the key, but still present in the value
                - verify the item exists and has a valid id, if not do not add it to key value pair
                - fixes error where meals tried adding items when they had none
                verify user owns the daily log for infor trying to get
            */        
            const query = `
            SELECT m.meal_id, m.meal_type, 
            COALESCE(
                json_object_agg(
                    m_i.meal_item_id,
                    to_json(m_i)
                ) FILTER (WHERE m_i.meal_item_id is NOT NULL),
                 '{}'::json
            ) AS items
            FROM daily_logs d_l
            JOIN meals m
                ON m.log_id = d_l.log_id
            LEFT JOIN meal_items m_i
                ON m_i.meal_id = m.meal_id
            WHERE d_l.log_id = $2 
            AND d_l.user_id = $1
            GROUP BY m.meal_id, m.meal_type
            ;`;
            

            const res = await pool.query(query, [user_id, log_id]);

            return res.rows ?? null;
        } catch (err) {
            throw err;
        }
    },

    // Returns the calculated amount of calories for all meal_items for all types of meals based on a days daily log
    getDayCalories : async({ log_id }) => {
        try{
            const query = `
            SELECT SUM(m_i.calories) AS total_calories
            FROM daily_logs d_l
            JOIN meals m
                ON d_l.log_id = m.log_id
            JOIN meal_items m_i
                ON m.meal_id = m_i.meal_id
            WHERE d_l.log_id = $1
            `;

            const res = await pool.query(query, [log_id]);
            return res.rows[0] ?? null;
        } catch (err) {
            throw err;
        }
    },

    deleteDailyLog : async({ log_id, user_id }) => {
        try {
            const query = `
                DELETE
                FROM daily_logs
                WHERE log_id = $1
                AND user_id = $2
            `;

            const res = await pool.query(query, [log_id, user_id]);
            // return wether or not log was found and deleted
            return res.rowCount > 0;
        } catch (err) {
            throw err;
        }
    },

}

module.exports = {
    dailyLogsRepo,
}