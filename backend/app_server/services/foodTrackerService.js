const { logger } = require('../utils/logger.js');

const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1';
const API_KEY = process.env.FOOD_DATA_API_KEY;

const foodTrackerService = {
    searchSingleItem : async ({ food_name }) => {
        try {
            const searchURL = `${USDA_API_URL}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(food_name)}&pageSize=1`;

            const res = await fetch(searchURL);
            const data = await res.json();

            return data.foods[0];
        } catch (err) {
            next(err);
        }
    },

    searchAllItems: async ({ food_name, page_number = 1 }) => {
        try {
            const url = new URL(`${USDA_API_URL}/foods/search`);

            url.search = new URLSearchParams({
                api_key: API_KEY,
                query: food_name,
                pageSize: 10,
                pageNumber: page_number,
                dataType: 'Branded'
            });

            const searchURL = url.toString();

            const res = await fetch(searchURL);
            const data = await res.json();

            return data.foods;

        } catch (err) {
            next(err);
        }
    },

    getSingleItemById : async ({ fdcId }) => {
        try {
            const searchURL = `${USDA_API_URL}/food/${fdcId}?api_key=${API_KEY}`;

            const res = await fetch(searchURL);
            const data = await res.json();

            return data;
        } catch (err) {
            next(err);
        }
    },

}

module.exports = { foodTrackerService };