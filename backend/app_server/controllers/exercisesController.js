const { exercisesService } = require('../services/exercisesService.js');
const { logger } = require('../utils/logger.js');

const exercisesController = {

    getAllExercises : async( req, res, next ) => {
        try {
            const result = await exercisesService.getAllExercises();

            res
                .status(200)
                .json({
                    success: true,
                    data: result,
                });

            console.log('Successfully retrieved exercise data');
        } catch (err) {
            logger.error(`Failed to retrieve all exercises ${err}`);
            next(err);
        }
    },

    getExerciseById : async(req, res, next) => {
        try {
            const { exercise_id } = req.params;
            const result = await exercisesService.getExerciseById({ exercise_id });

            let data = undefined;

            if(result.detail === 'Not found.') {
                data = {
                    success: false,
                    data: null,
                };
            } else {
                data = {
                    success: true,
                    data: result,
                }
            }

            res
                .status(200)   
                .json(data);

        } catch (err) {
            logger.error(`Failed to retrieve an exercise by id ${err}`);
            next(err);
        }
    },
}

module.exports = {
    exercisesController,
}