const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

const { pool } = require('../../app_server/db/db_connection');
const { createTestUser, deleteTestUser } = require('../helpers/testUser');


let test_user_id = null;
let test_token = null;

// Import and create new testUser for usersIntegration testing
beforeAll(async() => {
    const user = await createTestUser('users');
    test_user_id = user.test_user_id
    test_token = user.test_token;
    user_email = user.user_email;
});

// Make sure to delete user by testing delete user route
afterAll(async() => {
    await deleteTestUser(test_token);
});

// Check main users routes using valid inputs
describe('Use valid values for routes', () => {
    // POST verify logging a user in via email and password
    it('Should return 200 status code and valid token', async() => {
        const payload = {
            email: user_email,
            password: 'test',
        };
        const res = await request(app)
            .post('/api/users/login')
            .send(payload);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            expect(res.body.data.token).toBeDefined();
            test_token = res.body.data.token;
    });
    // GET properly verify getting a user via assigned token
    it('Should return 200 status code and user info from token.user_id', async() => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${test_token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user_id).toBeDefined();
    });
    // PUT verify user properly updated
    it('Should return 200 status code and new value for user', async() => {
        const payload = {
            name: 'test1',
        };
        const res = await request(app)
            .put('/api/users')
            .set('Authorization', `Bearer ${test_token}`)
            .send(payload);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            expect(res.body.data.name).toBe('test1');
    });
    // PUT add body details for test user using metric
    it('Should return 200 status code and updated values and  for user body_details', async() => {
        const payload = {
            height: '177',
            weight: 90,
            age: 21,
            gender: 'male',
            measurement_pref: 'metric',
            activity_level: 1
        };
        const res = await request(app)
            .put('/api/users/body_details')
            .set('Authorization', `Bearer ${test_token}`)
            .send(payload);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            // rough estimate based on online calculations for tdee
            expect(res.body.data.tdee).toBeDefined();
    });
    // PUT add body details for test user using imperial
    it("Should return 200 status code and updated values for user body_details", async() => {
        const payload = {
            height: "5'10",
            weight: 198,
            age: 21,
            gender: 'male',
            measurement_pref: 'imperial',
            activity_level: 1
        };
        const res = await request(app)
            .put('/api/users/body_details')
            .set('Authorization', `Bearer ${test_token}`)
            .send(payload);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            // rough estimate based on online calculations for tdee
            expect(res.body.data.tdee).toBeGreaterThan(2000);
            expect(res.body.data.tdee).toBeLessThan(2500);
    });
    // GET get users body details
    it('Should return a 200 status code and get user body details', async() => {
        const res = await request(app)
            .get('/api/users/body_details')
            .set('Authorization', `Bearer ${test_token}`);
        
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.tdee).toBeGreaterThan(2000);
            expect(res.body.data.tdee).toBeLessThan(2500);
    });
    // GET user daily calories
    it('Should return a 200 status code and value for user calories per day', async() => {
        const res = await request(app)
            .get('/api/users/daily_calories')
            .set('Authorization', `Bearer ${test_token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            // should be 2295 for maintenance calories for user body_details
            expect(res.body.data.daily_cals).toBeGreaterThan(2000);
            expect(res.body.data.daily_cals).toBeLessThan(2500);
    });
});

// Verify error handling with incorrect inputs for user routes
describe('Use invalid inputs for routes', () => {
    describe('Create new user tests with incorrect values', () => {
        // Attempt to create new user missing a value
        it('Send create user without email field, should return 500 status code', async() => {
            const payload = {
                name: 'false_test',
                password: 'false_test'
            };
            const res = await request(app)
                .post('/api/users')
                .send(payload);

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
        });
        it('Send create user without password field, should return 500 status code', async() => {
            const payload = {
                name: 'false_test',
                email: 'fasle_test@example.com',
            };
            const res = await request(app)
                .post('/api/users')
                .send(payload);

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
        });
        it('Send create user with incorrect types for all fields', async() => {
            const payload = {
                name: 12,
                password: Number.MAX_SAFE_INTEGER,
                email: 12.5,
            }

            const res = await request(app)
                .post('/api/users')
                .send(payload);

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
        });
        // Use incorrect values when updating body_details
        it('Should return a 400 error, use incorrect values when updating body details', async() => {
            const res = await request(app)
                .put('/api/users/body_details')
                .set('Authorization', `Bearer ${test_token}`)
                .send({
                    height: 120,
                });
        
                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
        }); 
    });
    describe('Authentication Validation Fail Tests', () => {
        it('Send get user with no token should return 401 no token error', async() => {
            const res = await request(app)
                .get('/api/users');

                expect(res.statusCode).toBe(401);
                expect(res.body.error).toBe('Authorization Error: No token provided');
                expect(res.body.success).toBe(false);
        });
        it('Send get user with invalid token, should return 401 invalid token error', async() => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer fail`);

                expect(res.statusCode).toBe(401);
                expect(res.body.success).toBe(false);
        });
        it('Send get daily calories with no token, should return 401 no token error', async() => {
                const res = await request(app)
                    .get('/api/users/daily_calories');

                expect(res.statusCode).toBe(401);
                expect(res.body.error).toBe('Authorization Error: No token provided');
                expect(res.body.success).toBe(false);
        });
        it('Update user with no token, should return 401 no token error', async() => {
            const payload = {
                name: 'test1',
            };
            const res = await request(app)
                .put('/api/users')
                .send(payload);

                expect(res.statusCode).toBe(401);
                expect(res.body.error).toBe('Authorization Error: No token provided');
                expect(res.body.success).toBe(false);
        });
        it('Delete user with no token, should return 401 no token error', async() => {
            const res = await request(app)
                .delete('/api/users');

                expect(res.statusCode).toBe(401);
                expect(res.body.error).toBe('Authorization Error: No token provided');
                expect(res.body.success).toBe(false);
        });
    });
});

