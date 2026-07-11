const { dailyLogsRepo } = require('../repositories/dailyLogsRepo.js');
const { mealItemsRepo } = require('../repositories/mealItemsRepo.js');
const { logger } = require('../utils/logger.js');
const { transporter } = require('../utils/nodemailer.js');
const { calculateMacroNutrients } = require('../../../shared/functions/calorie_calcs.ts');

const crypto = require('crypto');

const mealItemsService = {
    
    newMealItem : async ({ user_id, meal_id, fdc_id, food_name, brand_owner, serving_size, serving_amount, serving_unit, household_serving, macros}) => {
        const meal_item_id = crypto.randomUUID();

        const calories = calculateMacroNutrients(macros.calories, serving_unit, serving_amount, serving_size, household_serving);
        const protein = calculateMacroNutrients(macros.protein, serving_unit, serving_amount, serving_size, household_serving);
        const fat = calculateMacroNutrients(macros.fat, serving_unit, serving_amount, serving_size, household_serving);
        const carbohydrates = calculateMacroNutrients(macros.carbohydrates, serving_unit, serving_amount, serving_size, household_serving);

        const res = await mealItemsRepo.newMealItem({ user_id, meal_item_id, meal_id, fdc_id, food_name, brand_owner, serving_size, serving_amount, serving_unit, 
                                                        household_serving, calories, protein, fat, carbohydrates, per100_calories: macros.calories, 
                                                        per100_protein: macros.protein, per100_fat: macros.fat, per100_carbohydrates: macros.carbohydrates });
        return res;
    },

    updateMealItem: async({ user_id, meal_item_id, serving_unit, serving_amount, serving_size, household_serving, macros }) => {
        const calories = calculateMacroNutrients(macros.calories, serving_unit, serving_amount, serving_size, household_serving);
        const protein = calculateMacroNutrients(macros.protein, serving_unit, serving_amount, serving_size, household_serving);
        const fat = calculateMacroNutrients(macros.fat, serving_unit, serving_amount, serving_size, household_serving);
        const carbohydrates = calculateMacroNutrients(macros.carbohydrates, serving_unit, serving_amount, serving_size, household_serving);

        const res = await mealItemsRepo.updateMealItem({ user_id, meal_item_id, serving_unit, serving_amount, calories, protein, fat, carbohydrates });
        return res;
    },

    deleteMealItem : async ({ user_id, meal_item_id }) => {
        const res = await mealItemsRepo.deleteMealItem({ user_id, meal_item_id });

        return res;
    }

}

module.exports = {
    mealItemsService,
}