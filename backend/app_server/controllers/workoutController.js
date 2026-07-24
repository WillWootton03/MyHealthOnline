const { sendSuccess, sendError } = require('../utils/response.js'); 
const { logger } = require('../utils/logger.js');

const { workoutService } = require('../services/workoutServices.js');
const { dailyLogsService } = require('../services/dailyLogsService.js');
const { getTimeDifferenceInSeconds } = require('../../../shared/functions/formatting.ts');

const workoutController = {

    newWorkout : async(req, res, next) => {
        const { user_id } = req.user;

        const { workout } = req.body;

        if (!workout) {
            logger.error('FAILED newWorkout : workoutController : invalid workout in body');
            return sendError(
                res,
                'invalid workout in body',
                'INVALID OR NOT_FOUND'
            );
        }

        // Error handler for weird data passed in major factors
        if (!workout.id || !workout.startTime) {
            logger.error('FAILED newWorkout : workoutController : incorrect workout data in body');
            return sendError(
                res,
                'incorrect workout data in body',
                'INVALID OR NOT_FOUND'
            );
        }

        // Prevents empty workouts from being uploaded
        if(workout.exercises.length < 1 || workout.exercises.reduce((total, exercises) => total + exercises.sets.length, 0) < 1) {
            logger.error('FAILED newWorkout : workoutController : no workout data present');
            return sendError(
                res,
                'no workout data present',
                'INVALID_FIELD_INPUTS'
            );
        }

        try {
            const workoutResult = await workoutService.newWorkout({ user_id, workout });

            if (!workoutResult) {
                logger.error('FAILED newWorkout : workoutController : failed to add row');
                return sendError(
                    res,
                    'failed to add row',
                    'INVALID OR NOT_FOUND'
                );
            }

            logger.info('SUCCESS : newWorkout : successfully created a row for workout');
            // Return success here if no exercises logged, else log exercies
            if(workout.exercises?.length === 0) {
                    return sendSuccess(
                        res,
                        'Successfully created new workout',
                        workoutResult,
                    );
            } else {
                try {
                    const workout_id = workout.id;
                    const exercises = workout.exercises.filter(exercise => exercise.sets.length > 0);

                    if(!exercises) {
                        logger.error('FAILED newWorkout : workoutController : failed to add exercises, since no exercise had any valid complete sets');
                        return sendError(
                            res,
                            'failed to add exercises, since no exercise had any valid complete sets',
                            'INVALID_FIELD_INPUTS'
                        );
                    }

                    const exercisesResult = await workoutService.newExercises({ user_id, workout_id, exercises });

                    if(!exercisesResult) {
                        logger.error('FAILED newWorkout : workoutConroller : failed to create rows for exercises');
                        return sendError(
                            res,
                            'failed to create rows for exercises',
                            'INVALID or NOT_FOUND'
                        );
                    }

                    logger.info('SUCCESS : newWorkout : Successfully added new workout_exercise rows');

                    // Init sets with an array of all sets
                    const sets = workout.exercises.flatMap(exercise => 
                        exercise.sets.map(set => ({
                            ...set,
                            exercise_id: exercise.id
                        }))
                    );
                    console.log(sets);
                    // Attempt to add sets if exercise result succeeded
                    if(sets.length === 0) {
                            logger.info('SUCCESS : newWorkout : Successfully created workout and exercises');
                            return sendSuccess(
                                res,
                                'Successfully created workout and exercises',
                                exercisesResult,
                            );
                    } else {
                        try {
                            const setsResult = await workoutService.newSets({ user_id, workout_id, sets })

                            if(!setsResult) {
                                logger.error('FAILED newWorkout : workoutController : failed to create rows for sets');
                                return sendError(
                                    res,
                                    'failed to create new rows for sets',
                                    'INVALID or NOT_FOUND'
                                );
                            }

                            logger.info('SUCCESS : newWorkout : Successfully created sets');
                            return sendSuccess(
                                res,
                                'Successfully created workout, exerercises, and sets',
                                setsResult,
                            );

                        } catch (err) {
                            next(err);
                        }
                    }

                } catch (err) {
                    next(err)
                }
            }

        } catch (err) {
            next(err);
        }
    },

    newExercises : async(req, res, next) => {
        const { user_id } = req.user;
        const { workout_id, exercises } = req.body;

        try {
            const result = workoutService.newExercises({ user_id, workout_id, exercises });

            if(!result) {
                logger.error('FAILED newExercises : exercisesController : failed to add row');
                return sendError(
                    res,
                    'failed to add row',
                    'INVALID OR NOT_FOUND'
                );
            }

            logger.info('SUCCESS : newExercise : successfully created all rows for exercises');
            return sendSuccess(
                res,
                'successfully created all rows for exercises',
                result,
            );

            } catch (err) {
                next(err);
            }
    },

    newSets : async(req, res, next) => {
        const { user_id } = req.user;
        const { workout_exercise_id } = req.params;
        const { sets } = req.body;

        if(!workout_exercise_id || !sets) {
            logger.error('FAILED newSets : workoutController : Invalid inputs given');
            return sendError(
                res,
                'Invalid inputs given',
                'INVALID_FIELD_INPUTS'
            );
        }

        try {
            const result = await workoutService.newSets({ user_id, workout_exercise_id, sets });

            if(!result) {
                logger.error('FAILED newExercises : workoutController : failed to add row');
                return sendError(
                    res,
                    'failed to add row',
                    'INVALID OR NOT_FOUND'
                );
            }

            logger.info('SUCCESS : newSets : successfully added rows for sets');
                return sendSuccess(
                    res,
                    'successfully added rows for sets',
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
            logger.error('FAILED newCustomExercise : workoutController : invalid field input');
            return sendError(
                res,
                'invalid field input',
                'INVALID FIELD INPUT'
            );
        }

        try {
            const result = await workoutService.newCustomExercise({ user_id, custom_exercise });

            if(!result) {
                logger.error('FAILED newCustomExercise : workoutController : invalid or not found');
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
            logger.error('FAILED updateCustomExercise : workoutController : invalid updated exercise given');
            return sendError(
                res,
                'invalid updated exercise given',
                'INVALID_FIELD_INPUTS'
            );
        }

        try {
            const result = await workoutService.updateCustomExercise({ user_id, custom_exercise });

            if(!result) {
                logger.error('FAILED updateCustomExercise : workoutController : invalid or not found');
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
            const result = await workoutService.deleteCustomExercise({ user_id, custom_exercise_id });

            if(!result) {
                logger.error('FAILED deleteCustomExercise : workoutController : invalid or not found');
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
    workoutController
}