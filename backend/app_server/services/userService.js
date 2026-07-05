const { userRepo } = require('../repositories/userRepo.js');
const { logger } = require('../utils/logger.js');
const { transporter } = require('../utils/nodemailer.js');

const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const crypto = require('crypto');

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
        logger.debug(`USER SERVICE {Name: ${name}, Email: ${email}, User_id: ${user_id}, Password_hash: ${password_hash}}`);
        logger.info(`Create User on User Service Called: ${user_id}`);

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
                        expiresIn: '7d',
                    }
                );

                const mail = await transporter.sendMail({
                    from: process.env.APP_MAILER,
                    to: res.email,
                    subject: 'New User',
                    text: 'A new user account was created for your email for MyHealthOnline',
                    html: "<p>A new user account was created for your email for MyHealthOnline</p>"
                });
                logger.info(`Successfully sent account creation mail`);
            } catch (e){
                console.log(`Failed to send create account mail : ${e}`);
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
            logger.error(`Failed to verify password on ${user.user_id}`);
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
                expiresIn: '7d',
            }
        );



        return {
            user_id: user.user_id,
            token
        };
    },

    sendVerificationEmail : async({ user_id }) => {

        const user = await userRepo.getUserById({ user_id });

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
                        <a href="${process.env.FRONTEND_URL}/app/verify_email?token=${token}"> Verify Email </a>                
                    `,
                });
                logger.info(`Successfully sent email verification mail`);
            } catch (err){
                console.log(`Failed to send email verification mail : ${err}`);
                logger.error(`Failed to send create verification mail : ${err}`);
                throw new Error(`Failed to send create verification mail : ${err}`);
            }
        }
    },

    verify_email : async({ user_id }) => {
        await userRepo.verify_email({ user_id });
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
        const user = await userRepo.getUserById({ user_id });
       
        return user ;
    },

    getUserByEmail : async({ email }) => {
        const user = await userRepo.getUserByEmail({ email });

        return user ;
    },

    getUserDailyCalories : async({ user_id }) => {
        const res = await userRepo.getUserDailyCalories({ user_id });
        
        return res;
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
        if(password !== undefined) {
            password_hash = await argon2.hash(password);
        }
        
        const res = await userRepo.updateUser({ user_id, email, name, password_hash });

        return { res };
    },

    setBodyDetails : async({ user_id, height, weight, age, gender, activity_level }) => {
        // verifies all required fields are not null or undefined before attempting to calculate tdee
        if (user_id && height && weight && age && gender && activity_level) {

            console.log(height, weight, age, gender, activity_level);
            let BMR = (10 * weight) + (6.25 * height) - (5 * age);

            if (gender === 'male') {
                BMR += 5;
            } else {
                BMR -= 161;
            }

            switch(activity_level) {
                case 1:
                    BMR *= 1.2;
                    break;
                case 2:
                    BMR *= 1.375;
                    break;
                case 3:
                    BMR *= 1.55;
                    break;
                case 4:
                    BMR *= 1.725;
                    break;
                case 5:
                    BMR *= 1.9;
                    break;
            }
            
            const res = await userRepo.setBodyDetails({ 
                user_id, 
                height,
                weight, 
                age, 
                gender, 
                activity_level, 
                tdee: Math.floor(BMR)
            });
             
        } else {
            console.error('Body details not valid, cannot calculate TDEE');
            logger.error('Body details not valid, cannot calculate TDEE');
        }
    },

    /*
    *
    *
    * DELETE METHODS
    * 
    * 
    */

    deleteUser : async({ user_id }) => {
        await userRepo.deleteUser({ user_id });

    }
}

module.exports = { userService };