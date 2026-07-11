const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

/*
*
*
*
    NOTES : 
        Always use parameterized queries with 'SELECT * FROM users WHERE $1' 
        passing values in later when calling pool.query(query, [user_id])

        This prevents SQL injection from user input by seperating statements from user input
*
*
*
*/

const userRepo = {
    /*
    *
    *
    * 
    *  POST METHODS
    * 
    * 
    * 
    */

    // POST : create a new user and add to db
    /*
        user_id (UUID) : unique id and primary key for user table
        name (string) : string based on user name
        email (string) : unique email used for login and sending important account information
        password_hash (string) : hashedPassword from service based on plaintextPassword
    */
    createUser : async ({ user_id, name, email, password_hash }) => {
        logger.debug(`USER REPO {Name: ${name}, email: ${email}, password_hash: ${password_hash}, user_id: ${user_id}`)
        // Add new row to users and return data for new row
        const query = 'INSERT INTO users(user_id, name, email, password_hash) VALUES($1, $2, $3, $4) RETURNING *';
        // Use parameterized queries to prevent sql injection due to user input
        const values = [user_id, name, email, password_hash];

        try {
            const res = await pool.query(query, values);

            return res.rows[0] ?? null;
        } catch(err) {
            logger.error(`REPO Could Not Insert New User Row: ${err}`);

            throw err;
        }
    },

    /*
        user_id (string) : references the pk for users database on what to change in user data
        height (number) : an integer to hold height based on cm
        weight (number) : an integer to hold weight based on kg
        age (number) : an integer to hold age
        gender (string) : either male or female, is required to determine BMR
        activity_level (number) : a number to hold activity level based on levels between 1-5 
        tdee (number) : the number of calories estimated to help this user maintain their body weight 
    */
    setBodyDetails : async({ user_id, height, weight, age, gender, activity_level, measurement_pref, tdee }) => {

        const query = `
            UPDATE users
            SET height = $1, weight = $2, age = $3, gender = $4, activity_level = $5, measurement_pref = $6, tdee = $7
            WHERE user_id = $8
            RETURNING tdee
            `;

        try {
            const res = await pool.query(query, [height, weight, age, gender, activity_level, measurement_pref, tdee, user_id]);

            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`REPO FAILED to set user body details : ${err}`);
            throw err;
        }
    },

    /*
    *
    *
    * 
    *  GET METHODS
    * 
    * 
    * 
    */

    getUserById : async ({ user_id }) => {
        const query = `SELECT * FROM users WHERE user_id = $1`;

        try {
            const res = await pool.query(query, [user_id]);

            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`REPO FAILED to retrieve user by id: ${err}`);

            throw err;
        }
    },

    getUserByEmail : async ({ email }) => {
        // Query only returns one user since email is unique
        const query = `SELECT * FROM users WHERE email = $1`;

        try {
            const res = await pool.query(query, [email]);

            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`REPO FAILED to retrieve user by email: ${err}`)
            throw err;
        }
    },

    getUserDailyCalories : async ({ user_id }) => {
        try {
            const query = `
            SELECT tdee + calorie_change AS daily_cals
            FROM users
            WHERE user_id = $1
            `;

            const res = await pool.query(query, [user_id]);
            return res.rows[0] ?? null;
        } catch (err){
            logger.error(`REPO FAILED to get user daily calories ${err}`);
            throw (err);
        }
    },

    getUserBodyDetails : async ({ user_id }) => {
        try {
            const query = `
            SELECT height, weight, age, gender, activity_level, measurement_pref, tdee
            FROM users u
            WHERE u.user_id = $1
            `;

            const res = await pool.query(query, [user_id]); 
            return res.rows[0] ?? null;
        } catch(err) {
            throw err;
        }
    },
    
    /*
    *
    *
    * 
    *  PUT METHODS
    * 
    * 
    * 
    */
   
    updateUser : async ({ user_id, email, name, password_hash }) => {
        fields = [];
        values = [];
        let paramIndx = 1;


        if (email !== undefined) {
            fields.push(`email = $${paramIndx}`);
            values.push(email);
            ++paramIndx;
        }

        if (name !== undefined) {
            fields.push(`name = $${paramIndx}`)
            values.push(name);
            ++paramIndx;
        }

        if (password_hash !== undefined) {
            fields.push(`password_hash = $${paramIndx}`)
            values.push(password_hash);
            ++paramIndx;
        }

        // Adds user_id, paramIndx is also set to correct number at this point
        values.push(user_id);

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE user_id = $${paramIndx}
            RETURNING *
        `;

        try {
            const res = await pool.query(query, values);

            return res.rows[0] ?? null;
        } catch (err) {
            logger.error(`REPO FAILED to update user: ${err}`);

            throw err;
        }
    },

    verifyEmail : async ({ user_id }) => {
        const query = `
            UPDATE users
            SET is_verified = $1
            WHERE user_id = $2
        `;

        try {
            await pool.query(query, [true, user_id]);
        } catch (err) {
            logger.error(`REPO FAILED to verify user email: ${err}`);

            throw err;
        }

    },

    /*
    *
    *
    * 
    *  DELETE METHODS
    * 
    * 
    * 
    */

    deleteUser : async ({ user_id }) => {
        const query = `DELETE FROM users WHERE user_id = $1`

        try {
            const res = await pool.query(query, [user_id]);
            return res.rowCount > 0;
        } catch (err) {
            logger.error(`REPO FAILED to delete user from users: ${err}`);
            throw err;
        }
    }, 
}

module.exports = { userRepo };