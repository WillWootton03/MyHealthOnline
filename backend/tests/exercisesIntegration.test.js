const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

const { pool } = require('../app_server/db/db_connection');

const testToken = jwt.sign(
    {
        user_id: process.env.TEST_USER_ID
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '5m'
    },
);

// Make sure to delete all data from test user based on user_id and daily logs using ON DELETE CASCADE
afterAll(async() => {
    const q = 
        `DELETE 
        FROM daily_logs
        WHERE user_id = $1
        `;
    
    await pool.query(q, [process.env.TEST_USER_ID]);
    await pool.end();               // Close the pool connection once testing ends
});

describe('Wagr Exercise API Tests', () => {
    // Test valid inputs for api 
    describe('Use valid data for GET endpoints', () => {
        // Test to verify recieving data from / endpoint to get all exercises
        it('Should return a 200 status with success true and an array of exercise objects', async() => {
            const res = await request(app)
                .get('/api/exercises')
                .set('Authorization', `Bearer ${testToken}`);

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
                .set('Authorization', `Bearer ${testToken}`);

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
        it('Should return a 200 status code, with false success and no body data', async() => {
            const res = await request(app)
                .get('/api/exercises/incorrect')
                .set('Authorization', `Bearer ${testToken}`);

                // Verify status code to return that the request went through, but verify no success and no body data
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(false);
                expect(res.body.data).toBeNull();
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