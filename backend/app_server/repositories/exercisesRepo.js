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
    },

    newCustomExercise : async({ user_id, custom_exercise_id, name, description, category }) => {
        try {
            const query = `
                INSERT INTO custom_exercises(custom_exercise_id, name, description, category, user_id)
                SELECT $1, $2, $3, $4, $5
                FROM users u 
                    WHERE u.user_id = $5
                RETURNING *
            `

            const res = await pool.query(query, [custom_exercise_id, name, description, category, user_id ]);
            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`FAILED : newCustomExercise : exercisesRepo : failed insert new custom exercise : ${err}`);
            throw err;
        }
    },

    updateCustomExercise : async({ user_id, custom_exercise_id, name, description, category }) => {

        const fields = [];
        const values = [custom_exercise_id, user_id,];
        let paramIndx = 3;

        if (name !== undefined) {
            fields.push(`name = $${paramIndx}`);
            values.push(name);
            paramIndx++;
        }

        if (description !== undefined) {
            fields.push(`description = $${paramIndx}`);
            values.push(description);
            paramIndx++;
        }

        if (category !== undefined) {
            fields.push(`category = $${paramIndx}`);
            values.push(category);
            paramIndx++;
        }

        try {
            const query = `
                UPDATE custom_exercises 
                SET ${fields.join(', ')}
                WHERE custom_exercise_id = $1
                AND user_id = $2
                RETURNING *
            `

            console.log(query);
            console.log(values);

            const res = await pool.query(query, values);
            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`FAILED : updateCustomExercise : exercisesRepo : failed to update custom exercise : ${err}`);
            throw err;
        }
    },

    deleteCustomExercise : async({ user_id, custom_exercise_id }) => {
        try {
            const query = `DELETE FROM custom_exercises WHERE custom_exercise_id = $1 AND user_id = $2`;

            const res = await pool.query(query, [custom_exercise_id, user_id]);
            return res.rowCount > 0 ?? null;
        } catch (err) {
            logger.error(`FAILED : deleteCustomExercise : exercisesRepo : failed to delete custom exercise at id : ${err}`);
            throw err;
        }
    }

}

module.exports = {
    exercisesRepo,
}