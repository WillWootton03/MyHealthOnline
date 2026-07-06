const { exercisesRepo } = require('../repositories/exercisesRepo.js');
const { logger } = require('../utils/logger.js');

const WGER_API_URL = 'https://wger.de/api/v2';
const API_KEY = process.env.WORKOUT_DATA_API_KEY;

const HEADERS = {
    'Authorization' : API_KEY,
    'Content-type' : 'application/json',
}

const exercisesService = {

    getAllExercises : async() => {
        try {
            const url = `${WGER_API_URL}/exerciseinfo`;

            const res = await fetch(url, {
                method: 'GET',
                headers: HEADERS,
            });

            return res.json();
        } catch (err) {
            console.error(`Service Failed get all exercise by id${err}`);
            logger.error(`Service Failed to get all exercise by id${err}`);
        }

    },

    getExerciseById : async ({ exercise_id }) => {
        try {
            const url = `${WGER_API_URL}/exerciseinfo/${exercise_id}`;

            const res = await fetch(url, {
                method: "GET",
                headers: HEADERS,
            });

            return res.json();
        } catch(err) {
            console.error(`Service Failed get an exercise by id${err}`);
            logger.error(`Service Failed to get an exercise by id${err}`);
        }
    }

}

module.exports = {
    exercisesService,
}