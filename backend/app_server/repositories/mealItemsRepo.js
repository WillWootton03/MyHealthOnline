const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

const mealItemsRepo = {

    newMealItem : async ({ meal_item_id, meal_id, fdc_id, food_name, brand_owner, serving_size, serving_amount, 
                            serving_unit, household_serving, calories, protein, fat, carbohydrates, per100_calories, per100_protein, 
                            per100_fat, per100_carbohydrates }) => {
        try {
            const query = `
                INSERT INTO meal_items(meal_item_id, meal_id, fdc_id, food_name, brand_owner, serving_size, serving_amount, 
                                         serving_unit, household_serving, calories, protein, fat, carbohydrates, per100_calories, 
                                         per100_protein, per100_fat, per100_carbohydrates)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *
            `;

            const res = await pool.query(query, [meal_item_id, meal_id, fdc_id, food_name, brand_owner, serving_size, 
                                            serving_amount, serving_unit, household_serving, calories, protein, fat, carbohydrates,
                                            per100_calories, per100_protein, per100_fat, per100_carbohydrates]);

            logger.info(`Inserted new meal_item at ${meal_item_id}`);
            return res.rows[0];
        } catch (err) {
            console.error(`Failed to create meal_item for meal : ${err}`);
            logger.error(`Failed to create meal_item for meal : ${err}`);

            throw err;
        }
    },

    getDailyMealItems : async ({ log_id }) => {
        try {
            const query = `
                SELECT m.meal_id, m.meal_type, m_i.* 
                FROM meals m
                JOIN meal_items m_i
                    ON m_i.meal_id = m.meal_id
                WHERE m.log_id = $1 
            `;

            const res = await pool.query(query, [log_id]);

            logger.info(`Retrieved all meals and meal items for log at ${log_id}`)
            return res;
            console.log(res);
        } catch (err) {
            console.error(`Failed to get all meal_items for all meals on daily_log : ${err}`);
            logger.error(`Failed to get all meal_items for all meals on daily_log : ${err}`);

            throw err;
        }
    },

    updateMealItem : async ({ meal_item_id, serving_type, serving_amount, calories, protein, fat, carbohydrates }) => {
        try {
            const query = `
            UPDATE meal_items
            SET serving_unit = $1, serving_amount = $2, calories = $3, protein = $4, fat = $5, carbohydrates = $6
            WHERE meal_item_id = $7
            RETURNING *
            `;
            
            const res = await pool.query(query, [serving_type, serving_amount, calories, protein, fat, carbohydrates, meal_item_id]);

            console.log(`Updated meal item at ${meal_item_id}`);
            return res.rows[0];
        } catch (err) {
            console.error(`Failed to update meal item : ${err}`);
            logger.error(`Failed to update meal item : ${err}`);

            throw err;
        }
    },

    deleteMealItem : async ({ meal_item_id }) => {
        try {
            const query = `
            DELETE 
            FROM meal_items
            WHERE meal_item_id = $1
            `
            await pool.query(query, [meal_item_id]);
            console.log(`deleted meal item at ${meal_item_id}`);
        } catch (err) {
            console.error(`Failed to delete meal item : ${err}`);
            logger.error(`Failed to delete meal item : ${err}`);

            throw err;
        }
    },

}

module.exports = {
    mealItemsRepo,
}