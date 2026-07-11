const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

const { pool } = require('../../app_server/db/db_connection');
const { createTestUser, deleteTestUser } = require('../helpers/testUser');
const { createTestLog, deleteTestLog } = require('../helpers/testLog');
const { createTestMeal } = require("../helpers/testMeal"); 
const { createTestMealItem } = require('../helpers/testMealItem');

const { formatDate } = require('../../../shared/functions/formatting.ts');

let test_token = null;
let test_log_id = null;
let test_meal_id = null;

// Import and create new testUser for usersIntegration testing
beforeAll(async() => {
    const user = await createTestUser('daily_logs');
    test_token = user.test_token;
    test_log_id = await createTestLog(test_token);
    test_meal_id = await createTestMeal(test_log_id, test_token);
    await createTestMealItem(log_id, test_meal_id, test_token);
});

// Make sure to delete user by testing delete user route
afterAll(async() => {
    await deleteTestUser(test_token);
});

describe('Use valid inputs for daily logs routes', () => {
    // GET returns log_id for daily log based on date
    it('Should be able to get log_id from daily_logs', async() => {
        const res = await request(app)
            .get(`/api/daily_logs`)
            .query({
                date : formatDate(new Date(Date.now())),
            })
            .set('Authorization', `Bearer ${test_token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.log_id).toBe(test_log_id);
    });
    // GET returns the food data for all food items logged for the day
    it('Should return a 200 status code and an array of meals, with key value pairs for items', async() => {
        const res = await request(app)
            .get(`/api/daily_logs/${test_log_id}/food_data`)
            .set('Authorization', `Bearer ${test_token}`);

    
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data[0].items).toBeDefined();
    });
    // GET returns value for cals consumed during the day
    it('Should return a 200 status code and a number representing cals logged for the day', async() => {
        const res = await request(app)
            .get(`/api/daily_logs/${test_log_id}/day_calories`)
            .set('Authorization', `Bearer ${test_token}`);
    
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.total_calories).toBe(130);
    });
});


describe('Use invalid inputs for daily logs routes', () => {
    // Attempt to post a log with incorrect date string repo should throw error
    it('Should return a 500 error, attempt to post a log with incorrect date string', async() => {
        const res = await request(app)
            .post('/api/daily_logs')
            .query({
                date: 'check'
            })
            .set('Authorization', `Bearer ${test_token}`);
    
            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
    });
    // Attempt to get a daily log food_data with invalid log_id repo should throw error
    it('Should return a 500 error, attempt to get a daily_logs food_data with invalid log_id', async() => {
        const res = await request(app)
            .get(`/api/daily_logs/fake/food_data`)
            .set('Authorization', `Bearer ${test_token}`);
    
            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
    });
    // Attempt to get day's logged calories with invalid log_id repo should throw error 
    it('Should return a 500 error Attempt to get days logged calories with invalid log_id', async() => {
        const res = await request(app)
            .get(`/api/daily_logs/fake/day_calories`)
            .set('Authorization', `Bearer ${test_token}`);
    
            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
    });
});