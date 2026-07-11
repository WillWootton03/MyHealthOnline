const { userRepo } = require('../repositories/userRepo.js');
const { logger } = require('../utils/logger.js');
const { transporter } = require('../utils/nodemailer.js');

const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const crypto = require('crypto');

const { getBMR, getTDEE } = require('../../../shared/functions/body_calcs.ts');
const { feetToCm, lbsToKg } = require('../../../shared/functions/int_conversions.ts')

const userService = {

    /*
    *
    *
    * 
    *  POST METHODS
    * 
    * 
    * 
    */

    createUser : async ({ name, email, password }) => {
        const user_id = crypto.randomUUID();                             // generates random UUID for user_id
        const password_hash = await argon2.hash(password);               // hashes password using built in salting for extra security

        // Give token init undefined so if user isnt successfully created no token is generarted
        let token = undefined;
        const res = await userRepo.createUser({
            user_id,
            name,
            email,
            password_hash,
        });

        if(res) {
            try {
                // Set auth token for user when creating new account
                token = jwt.sign(
                    {
                        user_id: user_id
                    },
                    process.env.JWT_SECRET,
                    {
                        // Generate fast-expire token if in a test environment
                        expiresIn: process.env.NODE_ENV === 'test' ? '2m' : '7d',
                    }
                );

                const mail = await transporter.sendMail({
                    from: process.env.APP_MAILER,
                    to: res.email,
                    subject: 'New User',
                    text: 'A new user account was created for your email for MyHealthOnline',
                    html: "<p>A new user account was created for your email for MyHealthOnline</p>"
                });
            } catch (e){
                logger.error(`Failed to send create account mail : ${e}`)
            }
        }
        return { res, token };
    },

    emailLogin : async({ email, password }) => {
    
        // get user_id
        const user = await userRepo.getUserByEmail({ email });
        
        const valid = await argon2.verify(
          user.password_hash,
          password  
        );

        if (!valid) {
            const err = new Error(`Invalid Login Credentials`);
            err.status = 401;
            throw err;
        };

        // Set auth token for user
        const token = jwt.sign(
            {
                user_id: user.user_id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.NODE_ENV === 'test' ? '2m' : '7d',
            }
        );

        return {
            user_id: user.user_id,
            token
        };
    },

    sendVerificationEmail : async({ user_id }) => {

        const user = await userRepo.getUserById({ user_id });

        // Send a short temporary token for verifying email only
        const token = jwt.sign(
            { user_id: user_id },
            process.env.JWT_SECRET,
            { expiresIn: '15m'},
        );

        if (user){
            try {
                const mail = await transporter.sendMail({
                    from: process.env.APP_MAILER,
                    to: user.email,
                    subject: 'Verify Email',
                    html: 
                    `
                        <p>Please click the link below to verify your email for My Health Online</p>
                        <a href="${process.env.FRONTEND_URL}/app/verifyEmail?token=${token}"> Verify Email </a>                
                    `,
                });
            } catch (err){
                logger.error(`Failed to send create verification mail : ${err}`);
                throw err;
            }
        }
    },

    verifyEmail : async({ user_id }) => {
        await userRepo.verifyEmail({ user_id });
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

    getUserById : async({ user_id }) => {
        return await userRepo.getUserById({ user_id });
    },

    getUserDailyCalories : async({ user_id }) => {
        return await userRepo.getUserDailyCalories({ user_id });

    },

    getUserBodyDetails : async({ user_id }) => {
        return await userRepo.getUserBodyDetails({ user_id });
    },

    /*
    *
    *
    * PUT METHODS
    * 
    * 
    */

    updateUser : async({ user_id, email, name, password }) => {
        // Creates a new password hash if an updated password was passed into body
        let password_hash = undefined;
        if(password) {
            password_hash = await argon2.hash(password);
        }
        
        return await userRepo.updateUser({ user_id, email, name, password_hash });

    },

    setBodyDetails : async({ user_id, height, weight, age, gender, activity_level, measurement_pref }) => {
        // Set new height = to height, stays same if metric is measurment pref
        let calc_height = height;
        let calc_weight = weight
        // if measurement is not, parse cm measurement to calculate tdee
        if(measurement_pref === 'imperial') {
            // parse feet and inches from height string
            const [f, i] = height.split("'");
            calc_height = feetToCm(f, i);
            calc_weight = lbsToKg(weight);
        }
            return await userRepo.setBodyDetails({ 
            user_id, 
            height,
            weight, 
            age, 
            gender, 
            activity_level, 
            measurement_pref,
            tdee: getTDEE(getBMR(calc_height, calc_weight, age, gender), activity_level),
        });
    },

    /*
    *
    *
    * DELETE METHODS
    * 
    * 
    */

    deleteUser : async({ user_id }) => {
        return await userRepo.deleteUser({ user_id });
    }
}

module.exports = { userService };