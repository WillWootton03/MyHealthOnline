const { userService } = require('../services/userService.js');
const { logger } = require('../utils/logger.js');
const  jwt  = require('jsonwebtoken');
    
const userController = { 
    /*
    *
    *
    * 
    *  POST METHODS
    * 
    * 
    * 
    */

    createUser: async( req, res, next ) => {
        logger.info(`Controller attempting to create new user`);
        try {
            const { name, email, password } = req.body;
            logger.debug(`USER CONTROLLER {Name: ${name}, Email: ${email}}`)
            const result = await userService.createUser({ email, name, password });
            res
                .status(201)
                .json({
                    success: true,
                    data: result,
                });
            logger.info(`Controller successfully created new user`);
        } catch (e) {
            logger.error(`Controller failed to create new user : ${e}`);
            next(e);
        }
    },
    
    emailLogin : async(req, res, next) => {
        logger.info(`Controller attempting to login user by email`);
        try {
            const { email, password } = req.body;
            logger.debug(`USER CONTROLLER {Email: ${email}`);
            const result = await userService.emailLogin({ email, password });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });
            logger.info(`Controller successfully logged in user at email ${email}`)
        } catch (err) {
            logger.error(`Controller Failed to login user: ${err}`);
            next(err);
        }
    },

    sendVerificationEmail : async(req, res, next) => {

        const user_id = req.user.user_id ?? undefined;

        if (user_id === undefined) {
            logger.error('Not valid token, cannot send verification email');
            throw new Error('Invalid Token, cannot send verification email');
        }

        logger.info('Contoller attempting to send email verification email');
        try {
            const result = await userService.sendVerificationEmail({ user_id });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });

            console.log('Successfully sent verification email');    
            logger.info('Successfully sent verification email');
        } catch (err) {
            logger.error(`Could Not send verification email: ${err}`);
            console.error(`Could Not send verification email: ${err}`);
            next(err);
        }
    },

    verify_email : async(req, res, next) => {
        
        const { token } = req.body;

        console.log(token, req.body);

        if(!token) { return res.status(400).json({ succes: false, message: 'Invalid or Missing Token'});}

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user_id = decoded.user_id;

            console.log(decoded);
            console.log(user_id);

            await userService.verify_email({ user_id });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });
            console.log('Successfully verified email');    
            logger.info('Successfully verified email');
        } catch (err) {
            logger.error(`Could Not verify email: ${err}`);
            console.error(`Could Not verify email: ${err}`);
            next(err);
        }
        
    },
/*
*
*
* GET METHODS
*
*
*/

    getUser: async(req, res, next) => {
        // if no email or user_id is passed in body then it will be undefined.
        const { email } = req.body ?? {};

        const user_id = req.user.user_id ?? undefined;

        // Attempt to get user by id first
        if (user_id !== undefined) {
            logger.info(`Contoller attempting to retrieve user by id`);
            try {
                logger.debug(`USER CONTROLLER {User_Id: ${user_id}}`);
                const result = await userService.getUserById({ user_id });
                res
                    .status(200)
                    .json({
                        succes: true,
                        data: result,
                    });
                logger.info(`Controller Successfully retrieved user from id ${user_id}`);
            } catch (err) {
                logger.error(`Controller failed to retrieve user from user_id : ${err}`);
                next(err);
            }
        } 
        // If no user_id in body attempt to get user using email
        else if (email !== undefined) {
            logger.info(`Controller attemtpting to retrieve user by email`);
            try {
                logger.debug(`USER CONTROLLER {Email: ${email}`);
                const result = await userService.getUserByEmail({ email });

                res
                    .status(200)
                    .json({
                        success: true,
                        data: result,
                    });
                logger.info(`Contoller succeessfully retrieved user from email ${email}`);
            } catch (err) {
                logger.error(`Controller failed to retrieve user from email: ${err}`);
                next(err);
            }
        }
    },

/*
*
*
* PUT METHODS
*
*
*/

    updateUser : async(req, res, next) => {
        logger.info(`Controller attempting to update user`);
        try {
            const user_id = req.user.user_id;
            const { email, name, password } = req.body;
            logger.debug(`USER CONTROLLER {Email: ${email}, Name: ${name}`);
            const result = await userService.updateUser({ user_id, email, name, password });

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });
            logger.info(`Controller successfully updated user at user_id ${user_id}`);
        } catch (err) {
            logger.error(`Controller Failed to update user at user_id : ${err}`);
            next(err);
        }
    },

    setBodyDetails : async({ req, res, next }) => {
        logger.info(`Controller attempting to update user body details`);
        try {
            const user_id = req.user.user_id;
            const { height, weight, age, gender, activity_level } = req.body;
            logger.debug(`CALORIE_TRACKER CONTROLLER {HEIGHT: ${height}, WEIGHT: ${weight}, AGE: ${age}, GENDER: ${gender}, ACTIVITY_LEVEL: ${activity_level}`);

            if (gender !== 'male' && gender !== 'female') {
                logger.error(`Incorrect gender selected`);
                return next(new Error('Incorrect gender selected'));
            }

            const result = await calorieTrackerService.setBodyDetails({ user_id, height, weight, age, gender, activity_level});

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });

            logger.info(`Controller successfully updated body details at user_id : ${user_id}`);

        } catch (err) {
            logger.error(`Controller failed to set body details : ${err}`)
            next(err);
        }
    },

/*
*
*
* DELETE METHODS
*
*
*/

    deleteUser : async(req, res, next) => {
        logger.info(`Controller attempting to delete user`);
        try {
            const user_id = req.user.user_id;
            logger.debug(`USER CONTROLLER {User_id: ${user_id}`);
            const result = await userService.deleteUser({ user_id });

            res
                .status(200)
                .json({
                    succes: true,
                    data: result,
                });
            logger.info(`Controler successfully deleted user at user_id ${user_id}`);
        } catch (err) {
            logger.error(`Controller failed to delete user at user_id : ${err}`);
            next(err);
        }
    },
}

module.exports = { userController };