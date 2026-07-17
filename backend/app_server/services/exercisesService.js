const { exercisesRepo } = require('../repositories/exercisesRepo.js');
const { logger } = require('../utils/logger.js');
const  axios  = require('axios'); 

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

            return await res.json();
        } catch (err) {
            console.error(`Service Failed get all exercise by id${err}`);
            logger.error(`Service Failed to get all exercise by id${err}`);
        }

    },

    shortGetAllExercises : async() => {
        try {
            let url = `${WGER_API_URL}/exerciseinfo/?limit=850`

            const res = await axios.get(url, {headers: Headers});

            return (res.data.results.filter(exercise => exercise.language = 2).map(exercise => {
                return {
                    id: exercise.id,
                    name: exercise.translations?.find(t => t.language === 2)?.name,
                    category: exercise.category.name,
                    thumbnail: exercise.images?.[0]?.thumbnails?.small,
                }
            }));

        } catch(err) {
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