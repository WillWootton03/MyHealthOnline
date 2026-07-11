const { pool } = require('../db/db_connection.js');
const { logger } = require('../utils/logger.js');

const mealItemsRepo = {

    newMealItem : async ({ user_id, meal_item_id, meal_id, fdc_id, food_name, brand_owner, serving_size, serving_amount, 
                            serving_unit, household_serving, calories, protein, fat, carbohydrates, per100_calories, per100_protein, 
                            per100_fat, per100_carbohydrates }) => {

                            
        try {
            // Query to add all relevant data and verify this meal is owned by the same user that owns meal's daily log
            const query = `
                INSERT INTO meal_items(
                    meal_item_id, 
                    meal_id, 
                    fdc_id, 
                    food_name, 
                    brand_owner, 
                    serving_size, 
                    serving_amount, 
                    serving_unit, 
                    household_serving, 
                    calories, 
                    protein, 
                    fat, 
                    carbohydrates, 
                    per100_calories, 
                    per100_protein,
                    per100_fat,
                    per100_carbohydrates
                )
                SELECT 
                    $1, 
                    $2, 
                    $3, 
                    $4, 
                    $5, 
                    $6,
                    $7, 
                    $8, 
                    $9, 
                    $10, 
                    $11, 
                    $12, 
                    $13, 
                    $14, 
                    $15, 
                    $16, 
                    $17
                FROM meals m
                JOIN daily_logs d_l 
                    ON m.log_id = d_l.log_id
                WHERE m.meal_id = $2
                    AND d_l.user_id = $18
                RETURNING *
            `;

            const res = await pool.query(query, [meal_item_id, meal_id, fdc_id, food_name, brand_owner, serving_size, 
                                            serving_amount, serving_unit, household_serving, calories, protein, fat, carbohydrates,
                                            per100_calories, per100_protein, per100_fat, per100_carbohydrates, user_id]);
            
            return res.rows[0] ?? null; 
        } catch (err) {
            throw err;
        }
    },

    updateMealItem : async ({ user_id, meal_item_id, serving_unit, serving_amount, calories, protein, fat, carbohydrates }) => {
        try {
            const query = `
            UPDATE meal_items m_i
            SET serving_unit = $1, serving_amount = $2, calories = $3, protein = $4, fat = $5, carbohydrates = $6
            WHERE meal_item_id = $7
            AND EXISTS(
                SELECT 1
                FROM meals m
                JOIN daily_logs d_l
                    ON d_l.log_id = m.log_id
                WHERE m.meal_id = m_i.meal_id
                    AND d_l.user_id = $8
            )
            RETURNING *
            `;
            
            const res = await pool.query(query, [serving_unit, serving_amount, calories, protein, fat, carbohydrates, meal_item_id, user_id]);

            return res.rows[0] ?? null;
        } catch (err) {
            throw err;
        }
    },

    deleteMealItem : async ({ user_id, meal_item_id }) => {
        try {
            const query = `
            DELETE 
            FROM meal_items m_i
            USING meals m, daily_logs d_l
            WHERE m_i.meal_item_id = $1
                AND m.meal_id = m_i.meal_id
                AND d_l.log_id = m.log_id
                AND d_l.user_id = $2
            `
            const res = await pool.query(query, [meal_item_id, user_id]);
            return res.rowCount > 0;
        } catch (err) {
            throw err;
        }
    },

}

module.exports = {
    mealItemsRepo,
}