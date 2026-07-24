const { exercisesService } = require('../services/exercisesService.js');
const { logger } = require('../utils/logger.js');
const { sendSuccess, sendError } = require('../utils/response.js');

const exercisesController = {

    getAllExercises : async( req, res, next ) => {
        try {
            const result = await exercisesService.getAllExercises();

            logger.info('SUCCESS getAllExercises : successfully retrieved all exercises');
            return sendSuccess(
                res,
                'Sucessfully retrieved all exercises',
                result
            )

        } catch (err) {
            next(err);
        }
    },

    shortGetAllExercises : async(req, res, next) => {
        try {
            const result = await exercisesService.shortGetAllExercises();

            logger.info('SUCCESS shortGetAllExercises : successfully retrieved all exercises short version');
            return sendSuccess(
                res,
                'Successfully retrieved all exercises',
                result,
            )
        } catch (err) {
            next(err);
        }
    },

    customGetAllExercises : async(req, res, next) => {
        const { user_id } = req.user;
        try {
            const result = await exercisesService.customGetAllExercises({ user_id });

            if(!result) {
                logger.error('FAILED customGetAllExercises : exercisesController : not found or invalid');
                return sendError(
                    res,
                    'not found or invalid',
                    'NOT_FOUND or INVALID'
                );
            }

            logger.info('SUCCESS : customGetAllExercises : successfully retrieved all uses custom exercises');
                return sendSuccess(
                    res,
                    'successfully retrieved all uses custom exercises',
                    result,
                ); 
        } catch(err) {
            next(err);
        }
    },

    getExerciseById : async(req, res, next) => {
        try {
            const { exercise_id } = req.params;

            const result = await exercisesService.getExerciseById({ exercise_id });


            // API returns detail and detail is "Not found." if no exercise found
            if(result.detail === 'Not found.') {
                logger.error('FAILED getExerciseById : no item found at that exercise id');
                return sendError(
                    res,
                    'No item found at that exercise id',
                    'NOT_FOUND'
                )
            } 

            logger.info('SUCCESS getExerciseById : successfully retrieved exercise by id');
            return sendSuccess(
                res,
                'Successfully retrieved exercise by id',
                result,
            );

        } catch (err) {
            next(err);
        }
    },
    newCustomExercise : async(req, res, next) => {
        const { user_id } = req.user;
        const { custom_exercise } = req.body;

        if(!custom_exercise) {
            logger.error('FAILED newCustomExercise : exercisesController : invalid field input');
            return sendError(
                res,
                'invalid field input',
                'INVALID FIELD INPUT'
            );
        }

        try {
            const result = await exercisesService.newCustomExercise({ user_id, custom_exercise });

            if(!result) {
                logger.error('FAILED newCustomExercise : exercisesController : invalid or not found');
                return sendError(
                    res,
                    'invalid or not found',
                    'INVALID or NOT_FOUND'
                );
            }

            logger.info(`SUCCESS : newCustomExercise : successfully created a new custom exercise : user: ${user_id} : c_e : ${result.custom_exercsie_id}`);
                return sendSuccess(
                    res,
                    'successfully created a new custom exercise : ',
                    result,
                );
        } catch (err) {
            next(err);
        }
    },

    updateCustomExercise : async(req, res, next) => {
        const { user_id } = req.user;
        const { custom_exercise } = req.body;

        if(!custom_exercise) {
            logger.error('FAILED updateCustomExercise : exercisesController : invalid updated exercise given');
            return sendError(
                res,
                'invalid updated exercise given',
                'INVALID_FIELD_INPUTS'
            );
        }

        try {
            const result = await exercisesService.updateCustomExercise({ user_id, custom_exercise });

            if(!result) {
                logger.error('FAILED updateCustomExercise : exercisesController : invalid or not found');
                return sendError(
                    res,
                    'invalid or not found',
                    'INVALID or NOT_FOUND'
                );
            }

            logger.info('SUCCESS : updateCustomExercise : successfully update row with new values');
                return sendSuccess(
                    res,
                    'successfully update row with new values',
                    result,
                );
        } catch (err) {
            next(err);
        }
    },

    deleteCustomExercise : async(req, res, next) => {
        const { user_id } = req.user;
        const { custom_exercsie_id } = req.params;

        try {
            const result = await exercisesService.deleteCustomExercise({ user_id, custom_exercise_id });

            if(!result) {
                logger.error('FAILED deleteCustomExercise : exercisesController : invalid or not found');
                return sendError(
                    res,
                    'invalid or not found',
                    'INVALID or NOT_FOUND'
                );
            }

            logger.info(`SUCCESS : deleteCustomExercise : successfully deleted row at ${custom_exercise_id}`);
                return sendSuccess(
                    res,
                    `successfully deleted row at`,
                    result,
                );
        } catch (err) {
            next(err);
        }
    },
}

module.exports = {
    exercisesController,
}