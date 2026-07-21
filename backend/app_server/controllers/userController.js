const { userService } = require('../services/userService.js');
const  jwt  = require('jsonwebtoken');

const { sendSuccess, sendError } = require('../utils/response.js'); 
const { logger } = require('../utils/logger.js');
    
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
        try {
            const { name, email, password } = req.body;

            // Verify values are in body, and correct types
            if (!name || !email || !password || typeof password !== 'string' || typeof email !== 'string' || typeof name !== 'string') {
                logger.error('FAILED createUser : invalid inputs for required fields : INVALID_FIELD_INPUT');
                return sendError(
                    res,
                    'Invalid inputs for required fields',
                    'INVALID_FIELD_INPUT'
                );
            }

            const result = await userService.createUser({ name, email, password });
            if (!result) {
                logger.error('FAILED createUser : failed to create new user with credentials : POST_FAIL')
                return sendError(
                    res,
                    'Failed to create new user with credentials',
                    'POST_FAIL'
                );
            }
            
            logger.info('SUCCESS createUser : successfully created user');
            return sendSuccess(
                res,
                'Successfully created new user row',
                result
            );
        } catch (e) {
            next(e);
        }
    },
    
    emailLogin : async(req, res, next) => {


        try {
            const { email, password } = req.body;

            // email or password not present in body or not string
            if (typeof email !== 'string' && typeof password !== 'string') {
                logger.error('FAILED emailLogin : invalid email or password : INVALID_CREDENTIALS')
                return sendError(
                    res,
                    'invalid email or password',
                    'INVALID_CREDENTIALS'
                );
            }

            const result = await userService.emailLogin({ email, password });

            // execution failed in repo
            if(!result) {
                logger.error('FAILED emailLogin : unable to process user login attempt : LOGIN_FAILED');
                return sendError(
                    res,
                    'Unable to process user login attempt',
                    'LOGIN_FAILED'
                );
            }

            logger.info('SUCCESS emailLogin : user successfully logged in');
            return sendSuccess(
                res,
                'User successfully logged in',
                result
            );

        } catch (err) {
            next(err);
        }
    },

    sendVerificationEmail : async(req, res, next) => {
        const { user_id } = req.user;

        try {
            const result = await userService.sendVerificationEmail({ user_id });

            if (!result) {
                logger.error('FAILED sendVerificationEmail : failed to send verification email : NOT_FOUND');
                return sendError(
                    res,
                    'Failed to send verification email',
                    'NOT_FOUND',
                );
            }

            logger.info('SUCCESS sendVerificationEmail : successfully sent user email verification');
            return sendSuccess(
                res,
                'Successfully sent user email verification',
                result
            );

        } catch (err) {
            next(err);
        }
    },

    verifyEmail : async (req, res, next) => {
        const { token } = req.body;

        if(!token) { 
            logger.error('FAILED verifyEmail : invalid or missing token : UNAUTHORIZED')
            return sendError(
                res,
                'Invalid or missing token',
                'UNAUTHORIZED'
            )
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user_id = decoded.user_id ?? null;

            if(!user_id) {
                logger.error('FAILED verifyEmail : invalid user_id in token : UNAUTHORIZED');
                return sendError(
                    res,
                    'Invalid user_id in token',
                    'UNAUTHORIZED'
                );
            }

            const result = await userService.verifyEmail({ user_id });

            if(!result) {
                logger.error('FAILED verifyEmail : failed to verify user email : NOT_FOUND OR UNAUTHORIZED');
                return sendError(
                    res,
                    'Failed to verify user email',
                    'NOT_FOUND OR UNAUTHORIZED'
                );
            }

            logger.info('SUCCESS verifyEmail : successfully verified user email');
            return sendSuccess(
                res,
                'Successfully verified user email',
                result
            );

        } catch (err) {
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
        // get user id from token ONLY
        const { user_id } = req.user;

        try {
            const result = await userService.getUserById({ user_id });

            if (!result) {
                logger.error('FAILED getUser : no user found at user_id : NOT_FOUND');
                return sendError(
                    res,
                    'No user found at user_id',
                    'NOT_FOUND'
                );
            }

            logger.info('SUCCESS getUser : retrieved user from user_id');
            return sendSuccess(
                res,
                'Retrieved user from user_id',
                result
            );

        } catch (err) {
            next(err);
        }
    },

    getUserDailyCalories : async(req, res, next) => {
        // get daily calories only for current user in token
        const { user_id } = req.user;

        try {
            const result = await userService.getUserDailyCalories({ user_id });

            if (!result) {
                logger.error('FAILED getUserDailyCalories : did not find user daily calories for user');
                return sendError(
                    res,
                    'Failed to retrieve daily calories for user based on user_id',
                    'NOT_FOUND'
                );
            }

            logger.info('SUCCESS getUserDailyCalories : retrieved daily calories for user based on user_id');
            return sendSuccess(
                res,
                'Retrieved daily calories for user based on user_id',
                result  
            );

        } catch (err) {
            next(err);
        }
    },

    getUserBodyDetails : async (req, res, next) => {
        const { user_id } = req.user;

        try {
            const result = await userService.getUserBodyDetails({ user_id });

            if(!result) {
                logger.error('FAILED getUserBodyDetails : failed to retreive user body details');
                return sendError(
                    res,
                    'Failed to retrieve user body details',
                    'NOT_FOUND OR UNAUTHORIZED'
                );
            }

            logger.info('SUCCESS getUserBodyDetails : successfully retrieved user body details');
            return sendSuccess(
                res,
                'Sucessfully retrieved user body details',
                result,
            );

        } catch (err) {   
            next(err)
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
        const { user_id } = req.user;
        try {
            const { email, name, password } = req.body;

            // Verify inputs are all valid, and if an input is valid that it is the correct type
            if (
                (!email && !name && !password) || 
                (email && typeof email !== 'string') || (name && typeof name !== 'string') || ( password && typeof password !== 'string')
            ) {
                logger.error('FAILED updateUser : invalid inputs : INVALID_FIELD_INPUT');
                return sendError(
                    res,
                    'Invalid inputs',
                    'INVALID_FIELD_INPUT'
                );
            }  
            const result = await userService.updateUser({ user_id, email, name, password });

            if(!result) {
                logger.error('FAILED updateUser : failed to update user at user_id : NOT_FOUND');
                return sendError(
                    res,
                    'Failed to update user at user_id',
                    'NOT_FOUND',
                );
            }

            logger.info('SUCCESS updateUser : successfully updated user at user_id');
            return sendSuccess(
                res,
                'Successfully updated user at user_id',
                result
            );

        } catch (err) {
            next(err);
        }
    },

    setBodyDetails : async( req, res, next ) => {
        const { user_id } = req.user;

        try {
            const { height, weight, age, gender, activity_level, measurement_pref } = req.body;

            // Verify at least one new value present, and if present is the right input type 
            if(
                (!height && !weight && !age && !gender && !activity_level && !measurement_pref) ||
                (height && typeof height !== 'string') || (weight && typeof weight !== 'number') 
                || (age && typeof age !== 'number') || (gender && typeof gender !== 'string') || (activity_level && typeof activity_level !== 'number')
                || (measurement_pref && typeof measurement_pref !== 'string')
        ) {
            logger.error('FAILED setBodyDetails : invalid field inputs for body details');
            return sendError(
                res,
                'Invalid field inputs for body details',
                'INVALID_FIELD_INPUTS'
            );
        }

            const result = await userService.setBodyDetails({ user_id, height, weight, age, gender, activity_level, measurement_pref});

            if (!result) {
                logger.error('FAILED setBodyDetails : failed to update user body details');
                return sendError(
                    res,
                    'Failed to update user body details',
                    'NOT_FOUND'
                );
            }

            logger.info(`SUCCESS setBodyDetails : updated body details at user_id`);
            return sendSuccess(
                res,
                'Successfully updated user body details',
                result
            );

        } catch (err) {
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
        try {
            const { user_id } = req.user;
            const result = await userService.deleteUser({ user_id });

            if (!result) {
                logger.error('FAILED deleteUser : user not found or db returned')
                return sendError(
                    res,
                    'Failed to delete user, not found',
                    'NOT_FOUND'
                );
            }

            logger.info(`SUCCESS deleteUser : deleted user at user_id`);
            return sendSuccess(
                res,
                'Successfully deleted user row',
            )

        } catch (err) {
            next(err);
        }
    },
}

module.exports = { userController };