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
                'Sucessfully retrieved all excersizes',
                result
            )

        } catch (err) {
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