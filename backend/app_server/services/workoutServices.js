const { workoutRepo } = require('../repositories/workoutRepo.js');
const { dailyLogsService } = require('../services/dailyLogsService.js');
const { logger } = require('../utils/logger.js');

const { getTimeDifferenceInSeconds } = require('../../../shared/functions/formatting.ts');
const { randomUUID } = require('crypto');

const workoutService = {
    newWorkout : async({ user_id, workout }) => {

        // Create a new log if one not present for this date
        let log_id = null;
        if (!workout.log_id) {
            // Get date given from startTime in workout or from today.
            date = workout.startTime?.split("T")[0] ?? new Date().toLocaleDateString().split("T")[0];

            const check_log = await dailyLogsService.getDayLogId({ user_id, date});

            check_log ? log_id = check_log.log_id : log_id = await dailyLogsService.newDailyLog({user_id, date}).log_id
        } else {
            log_id = workout.log_id;
        }
        const duration = getTimeDifferenceInSeconds(new Date(), new Date(workout.startTime));
        const workout_id = workout.id;


        return workoutRepo.newWorkout({ workout_id, log_id, duration, user_id});

    },

    newExercises : async({ user_id, workout_id, exercises }) => {
        return workoutRepo.newExercises({ user_id, workout_id, exercises })
    },

    // Workout exercise ID should come on sets objects
    newSets : async({ user_id, workout_id, sets }) => {
        return workoutRepo.newSets({ user_id, workout_id, sets });
    },

    newCustomExercise : async({ user_id, custom_exercise }) => {
        const custom_exercise_id = crypto.randomUUID();
        const { name, description, category } = custom_exercise;

        return workoutRepo.newCustomExercise({ user_id, custom_exercise_id, name, description, category });
    },

    updateCustomExercise : async({ user_id, custom_exercise }) => {
        const { custom_exercise_id, name, description, category } = custom_exercise;

        return workoutRepo.updateCustomExercise({ user_id, custom_exercise_id, name, description, category });
    },

    deleteCustomExercise : async({ user_id, custom_exercise_id }) => {
        return workoutRepo.deleteCustomExercise({ user_id, custom_exercise_id });
    },
}

module.exports = { 
    workoutService
}