const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

const dailyLogsRepo = {

    newDailyLog : async ({ user_id, log_id, date }) => {
        const writeDate = date ? new Date(date) : new Date();
        try {
            const query = `
            INSERT INTO daily_logs(log_id, user_id, date)
            VALUES ($1, $2, $3)
            RETURNING *
            `;
            const res = await pool.query(query, [log_id, user_id, writeDate.toDateString()])
            
            logger.info(`Inserted new daily log at ${log_id}`);
            return res.rows[0];
        }catch (err) {
            console.error(`Failed to create daily log for user : ${err}`);
            logger.error(`Failed to create daily log for user : ${err}`);

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
            return res.rows[0];
        } catch (err) {
            console.error(`Failed to get daily log for user : ${err}`);
            logger.error(`Failed to get daily log for user : ${err}`);

            throw err;
        }
    },

    /*
        GET : returns all meal_id's for all meals logged for a day along with meal type, and all meal_items and data for each meal item based on meal_id and log_id
    */
    getFoodData : async ({ log_id }) => {
        try{        
            const query = `
            SELECT m.meal_id, m.meal_type, json_agg(m_i) AS items
            FROM daily_logs d_l
            JOIN meals m
                ON m.log_id = d_l.log_id
            LEFT JOIN meal_items m_i
                ON m_i.meal_id = m.meal_id
            WHERE d_l.log_id = $1 
            GROUP BY m.meal_id, m.meal_type
            ;`;
            

            const res = await pool.query(query, [log_id]);
            return res.rows;
        } catch (err) {
            console.error(`Failed to get food data from log_id : ${err}`);
            logger.error(`Failed to get food data from log_id : ${err}`);

            throw err;
        }
    },

    // Returns the calculated amount of calories for all meal_items for all types of meals based on a days daily log
    getDayCalories : async({ log_id }) => {
        console.log(log_id);
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
            return res.rows[0];
        } catch (err) {
            console.error(`Failed to get day calories from log_id : ${err}`);
            logger.error(`Failed to get day calories from log_id : ${err}`);

            throw err;
        }
    },
}

module.exports = {
    dailyLogsRepo,
}