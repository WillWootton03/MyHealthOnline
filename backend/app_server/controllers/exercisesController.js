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
}

module.exports = {
    exercisesController,
}