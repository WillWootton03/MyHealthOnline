const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

const workoutRepo = {

    newWorkout : async({ workout_id, log_id, duration, user_id }) => {

        try {
            const query = `
                INSERT INTO workouts(workout_id, log_id, duration_seconds)
                SELECT $1, $2, $3
                    FROM daily_logs d_l
                        WHERE d_l.log_id = $2
                        AND d_l.user_id = $4
                RETURNING *
            `
            const res = await pool.query(query, [workout_id, log_id, duration, user_id])
            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`FAILED : newWorkout : workoutRepo : failed insert new workout : ${err}`);
            throw err;
        }
    },

    newExercises : async({ user_id, workout_id, exercises }) => {
        try {
            const values = [];
            const params = [ user_id, workout_id ];

            exercises.forEach((exercise, index) => {
                const offset = index * 6;

                values.push(
                    `($${offset + 3}::uuid, $2::uuid, $${offset + 4}::text, $${offset + 5}::text, $${offset + 6}::double precision, $${offset + 7}::double precision, $${offset + 8}::integer)`
                );

                params.push(
                    exercise.id,
                    exercise.name,
                    exercise.category,
                    parseFloat(exercise.totalWeight ?? 0) ,
                    parseInt(exercise.totalReps ?? 0),
                    exercise.exercise_id,
                )
            })
            const query = `
                WITH verified AS (
                    SELECT 1
                    FROM workouts w
                    JOIN daily_logs d_l
                        ON d_l.log_id = w.log_id
                    WHERE w.workout_id = $2::uuid
                        AND d_l.user_id = $1
                )
                INSERT INTO workout_exercises (workout_exercise_id, workout_id, exercise_name, category, total_weight, total_reps, exercise_id)
                SELECT *
                FROM (
                    VALUES
                    ${values.join(',')}
                ) AS v(workout_exercise_id, workout_id, exercise_name, category, total_weight, total_reps, exercise_id)
                WHERE EXISTS (SELECT 1 from verified)
                RETURNING *
            `

            const res = await pool.query(query, params);
            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`FAILED : newExercises : workoutRepo : failed insert new workout exercises : ${err}`);
            throw err;
        }
    },

    newSets : async({ user_id, workout_id, sets }) => {
        try {
            const values = [];
            const params = [ user_id, workout_id ];

            sets.forEach((set, index) => {
                const offset = index * 5;

                values.push(`($${offset + 3}::uuid, $${offset + 4}::double precision, $${offset + 5}::integer, $${offset + 6}::integer, $${offset + 7}::uuid)`)

                params.push(
                    set.id,
                    parseFloat(set.weight),
                    parseInt(set.reps),
                    parseInt(set.restTime),
                    set.exercise_id,
                )
            });

            const query = `
                WITH verified AS (
                    SELECT 1
                    FROM workouts w
                    JOIN daily_logs d_l
                        ON d_l.log_id = w.log_id
                    WHERE w.workout_id = $2::uuid
                        AND d_l.user_id = $1 
                )
                INSERT INTO workout_sets(workout_set_id, weight, reps, rest_time_seconds, workout_exercise_id)
                SELECT 
                    v.workout_set_id, 
                    v.weight, 
                    v.reps, 
                    v.rest_time_seconds,
                    v.workout_exercise_id
                FROM (
                    VALUES
                        ${values.join(',')}
                ) AS v(workout_set_id, weight, reps, rest_time_seconds, workout_exercise_id)
                JOIN workout_exercises w_e
                    ON w_e.workout_exercise_id = v.workout_exercise_id
                WHERE EXISTS (SELECT 1 FROM verified)
                RETURNING *
            `
            const res = await pool.query(query, params);
            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`FAILED : newSets : workoutRepo : failed insert new sets : ${err}`);
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
            logger.error(`FAILED : newCustomExercise : workoutRepo : failed insert new custom exercise : ${err}`);
            throw err;
        }
    },

    updateCustomExercise : async({ user_id, exercise_id, name, description, category }) => {

        const fields = [];
        const values = [exercise_id, user_id,];
        let paramIndx = 2;

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
                WHERE id = $1
                AND user_id = $2
                RETURNING *
            `

            const result = await pool.query(query, values);
            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`FAILED : updateCustomExercise : workoutRepo : failed to update custom exercise : ${err}`);
            throw err;
        }
    },

    deleteCustomExercise : async({ user_id, custom_exercise_id }) => {
        try {
            const query = `DELETE FROM custom_exercises WHERE id = $1 AND user_id = $2`;

            const result = await pool.query(query, [custom_exercise_id, user_id]);
            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`FAILED : deleteCustomExercise : workoutRepo : failed to delete custom exercise at id : ${err}`);
            throw err;
        }
    }

}

module.exports = {
    workoutRepo
}