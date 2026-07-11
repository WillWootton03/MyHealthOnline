const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

const { pool } = require('../../app_server/db/db_connection');
const { createTestUser, deleteTestUser } = require('../helpers/testUser');
const { createTestLog, deleteTestLog } = require('../helpers/testLog');
const { createTestMeal } = require("../helpers/testMeal"); 
const { createTestMealItem } = require('../helpers/testMealItem');

const { formatDate } = require('../../../shared/functions/formatting');

let test_token = null;
let test_log_id = null;
let test_meal_id = null;
let test_meal_item_id = null;

// Import and create new testUser for usersIntegration testing
beforeAll(async() => {
    const user = await createTestUser('meal_items');
    test_token = user.test_token;
    test_log_id = await createTestLog(test_token);
    test_meal_id = await createTestMeal(test_log_id, test_token);
    test_meal_item_id = await createTestMealItem(log_id, test_meal_id, test_token);
});

// Make sure to delete user by testing delete user route
afterAll(async() => {
    await deleteTestUser(test_token);
});


describe('Use valid inputs for meal_items routes', () => {
    // UPDATE a meal items serving type
    it('Should return a 200 status code and an updated meal item', async() => {
        const res = await request(app)
            .put(`/api/meal_items/${test_meal_item_id}`)
            .send({
                serving_unit: '1 CRACKER',
                serving_amount: 1,
                serving_size: 27.799999237060547,
                household_serving: '3 CRACKERS',
                macros: { calories: 468, protein: 7.19, fat: 21.6, carbohydrates: 57.6 }
            })
            .query(test_meal_item_id)
            .set('Authorization', `Bearer ${test_token}`);
    
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.calories).toBe(43);
    });
    // UPDATE a meal items serving amount
    it('Should return a 200 status code and an updated meal item', async() => {
        const res = await request(app)
            .put(`/api/meal_items/${test_meal_item_id}`)
            .send({
                meal_id: test_meal_id,
                serving_unit: '1 CRACKER',
                serving_amount: 10,
                serving_size: 27.799999237060547,
                household_serving: '3 CRACKERS',
                macros: { calories: 468, protein: 7.19, fat: 21.6, carbohydrates: 57.6 }
            })
            .query(test_meal_item_id)
            .set('Authorization', `Bearer ${test_token}`);
    
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.calories).toBe(434)
    });
    // DELETE verify deleting meal_item
    it('Should return a 200 status code and returns success for deleting itme', async() => {
        const res = await request(app)
            .delete(`/api/meal_items/${test_meal_item_id}`)
            .set('Authorization', `Bearer ${test_token}`);
    
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
    });
});