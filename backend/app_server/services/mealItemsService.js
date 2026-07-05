const { dailyLogsRepo } = require('../repositories/dailyLogsRepo.js');
const { mealItemsRepo } = require('../repositories/mealItemsRepo.js');
const { logger } = require('../utils/logger.js');
const { transporter } = require('../utils/nodemailer.js');

const crypto = require('crypto');

const mealItemsService = {
    
    newMealItem : async ({ meal_id, fdc_id, food_name, brand_owner, serving_size, serving_amount, serving_unit, household_serving, macros, per_100}) => {
        const meal_item_id = crypto.randomUUID();

        let calories, protein, fat, carbohydrates;

        // Split up the macros object to put all important macros into their own variables into the repo
        macros.forEach((macro) => {
            switch (macro.type) {
                case 'calories':
                    calories = macro.amount;
                    break;
                case 'protein':
                    protein = macro.amount;
                    break;
                case 'fat':
                    fat = macro.amount;
                    break;
                case 'carbohydrates':
                    carbohydrates = macro.amount;
                    break;
            }
        });

        // Split up the per100 data from the array of per_100
        const per100_calories = per_100[0] , per100_protein = per_100[1], per100_fat = per_100[2], per100_carbohydrates = per_100[3];
  
        console.log(per_100);

        const res = await mealItemsRepo.newMealItem({ meal_item_id, meal_id, fdc_id, food_name, brand_owner, serving_size, serving_amount, serving_unit, 
                                                        household_serving, calories, protein, fat, carbohydrates, per100_calories, per100_protein, 
                                                        per100_fat, per100_carbohydrates });

        return res;
    },

    updateMealItem: async({ meal_item_id, serving_type, serving_amount, macros }) => {
        let calories, protein, fat, carbohydrates;

        // Split up the macros object to put all important macros into their own variables into the repo
        macros.forEach((macro) => {
            switch (macro.type) {
                case 'calories':
                    calories = macro.amount;
                    break;
                case 'protein':
                    protein = macro.amount;
                    break;
                case 'fat':
                    fat = macro.amount;
                    break;
                case 'carbohydrates':
                    carbohydrates = macro.amount;
                    break;
            }
        });

        const res = await mealItemsRepo.updateMealItem({ meal_item_id, serving_type, serving_amount, calories, protein, fat, carbohydrates });

        return res;
    },

    deleteMealItem : async ({ meal_item_id }) => {
        const res = await mealItemsRepo.deleteMealItem({ meal_item_id });

        return res;
    }

}

module.exports = {
    mealItemsService,
}