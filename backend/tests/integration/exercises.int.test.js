const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

const { pool } = require('../../app_server/db/db_connection');
const { createTestUser, deleteTestUser } = require('../helpers/testUser');

let test_token = null;

// Import and create new testUser for usersIntegration testing
beforeAll(async() => {
    const user = await createTestUser('exercises');
    test_token = user.test_token;
});

// Make sure to delete user by testing delete user route
afterAll(async() => {
    await deleteTestUser(test_token);
});

describe('Wagr Exercise API Tests', () => {
    // Test valid inputs for api 
    describe('Use valid data for GET endpoints', () => {
        // Test to verify recieving data from / endpoint to get all exercises
        it('Should return a 200 status with success true and an array of exercise objects', async() => {
            const res = await request(app)
                .get('/api/exercises')
                .set('Authorization', `Bearer ${test_token}`);

                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                
                // Verify results for workouts is an array and is longer than 1
                expect(res.body.data).toBeDefined();
                expect(Array.isArray(res.body.data.results)).toBe(true);
                expect(res.body.data.results.length).toBeGreaterThan(1);
        });
    
        it('Should return a 200 status with success true and a single exercise object', async() => {
            const res = await request(app)
                .get('/api/exercises/1962')
                .set('Authorization', `Bearer ${test_token}`);

                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);

                // Verify the id returned is the one provided
                expect(res.body.data).toMatchObject({
                    "id" : 1962
                });
        });

    });
    // Verify incorrect data returns correct responses
    describe('Use invalid data for GET endpoints', () => {
        // Verify invalid data in route operates correctly
        it('Should return a 400 status code, with false success and no body data', async() => {
            const res = await request(app)
                .get('/api/exercises/incorrect')
                .set('Authorization', `Bearer ${test_token}`);

                // Verify status code to return that the request went through, but verify no success and no body data
                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
        });
        // Verify 401 missing token error when accessing get all exercises
        it('Should return a 401 authentication error for no valid jwt token', async() => {
            const res = await request(app)
                .get('/api/exercises')
                
                expect(res.statusCode).toBe(401);
        });
    });
    // Verify 401 missing token error when accessing get exercise by id
    it('Should return a 401 authentication error for no valid jwt token', async() => {
        const res = await request(app)
            .get('/api/exercises/1962')

            expect(res.statusCode).toBe(401);
    });

});