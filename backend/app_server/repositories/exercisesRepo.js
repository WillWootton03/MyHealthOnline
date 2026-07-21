const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

const exercisesRepo = {

    customGetAllExercises: async({ user_id }) => {
        try {
            const query = `
                SELECT * 
                FROM custom_exercises
                WHERE user_id = $1
            `
            const res = await pool.query(query, [user_id]);
            return res.rows ?? null;
        } catch (err) {
            logger.error(`FAILED : customGetAllExercises : exercisesRepo : failed to get custom exercises for user : ${err}`);
            throw err;
        }
    }

}

module.exports = {
    exercisesRepo,
}