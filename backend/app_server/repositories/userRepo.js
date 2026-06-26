const { pool } = require('../db/db_connection.js');
const { pg } = require('pg');
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
        logger.debug(`USER REPO {Name: ${name}, Email: ${email}, password_hash: ${password_hash}, user_id: ${user_id}`)
        // Add new row to users and return data for new row
        const query = 'INSERT INTO users(user_id, name, email, password_hash) VALUES($1, $2, $3, $4) RETURNING *';
        // Use parameterized queries to prevent sql injection due to user input
        const values = [user_id, name, email, password_hash];

        try {
            const res = await pool.query(query, values);

            console.log(`REPO Created New User Row: ${user_id}`);
            logger.info(`REPO Created new User Row: ${user_id}`);
            return res.rows[0];
        } catch(err) {
            console.error(`REPO Could Not Insert New User Row: ${err}`)
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
    setBodyDetails : async({ user_id, height, weight, age, gender, activity_level, tdee }) => {
        const fields = `height = $1, weight = $2, age = $3, gender = $4, activity_level = $5, tdee = $6`;

        const query = `
            UPDATE users
            SET ${fields}
            WHERE user_id = $7
            RETURNING tdee
            `;

        try {
            const res = await pool.query(query, [height, weight, age, gender, activity_level, tdee, user_id]);

            console.log(`REPO User body details set at user_id : ${user_id}`);
            logger.info(`REPO User body details set at user_id : ${user_id}`);
            return res.rows[0];
        } catch (err) {
            console.error(`REPO Failed to set user body details : ${err}`);
            logger.error(`REPO Failed to set user body details : ${err}`);

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

            console.log(`REPO Retrieved user by id at ${user_id}`);
            logger.info(`REPO Retrieved user by id at ${user_id}`);
            return res.rows[0];
        } catch (err) {
            console.error(`REPO Could not retrieve user by id: ${err}`);
            logger.error(`REPO Could not retrieve user by id: ${err}`);

            throw err;
        }
    },

    getUserByEmail : async ({ email }) => {
        // Query only returns one user since email is unique
        const query = `SELECT * FROM users WHERE email = $1`;

        try {
            const res = await pool.query(query, [email]);

            console.log(`REPO Retrieved user at ${email}`);
            logger.info(`REPO Retrieved user by email at ${email}`);
            
            // If no User is found
            if(!res.rows[0]) {
                const err = new Error('User not found with that email');
                err.status = 401;
                throw err;
            }
            return res.rows[0];
        } catch (err) {
            logger.error(`REPO Could not retrieve user by email: ${err}`)
            console.error(`REPO Could not retrieve user by email: ${err}`);

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

            console.log(`REPO User updated using ${query} as update query`);
            logger.info(`REPO User updated using ${query} as update query`);
            return res.rows[0];
        } catch (err) {
            console.error(`REPO Failed to update user using ${query} as update query : ${err}`);
            logger.error(`REPO Failed to update user using ${query} as update query: ${err}`);

            throw err;
        }
    },

    verify_email : async ({ user_id }) => {
        const query = `
            UPDATE users
            SET is_verified = $1
            WHERE user_id = $2
        `;

        try {
            await pool.query(query, [true, user_id]);

            console.log(`REPO User email verified`);
            logger.info(`REPO User at ${user_id} email verified`);
        } catch (err) {
            console.error(`REPO Failed to verify user email : ${err}`);
            logger.error(`REPO Failed to verify user email at ${user_id}: ${err}`);

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

            console.log(`REPO User deleted from users at ${user_id}`);
            logger.info(`REPO User deleted from users at ${user_id}`);
        } catch (err) {
            console.error(`REPO Failed to delete user from users: ${err}`);
            logger.error(`REPO Failed to delete user from users: ${err}`);

            throw err;
        }
    }, 
}

module.exports = { userRepo };