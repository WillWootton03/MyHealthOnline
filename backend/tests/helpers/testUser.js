const request = require('supertest');
const app = require('../../app');

// POST validate creating a user
async function createTestUser(test_env) {
    const payload = {
        name: 'new_test',
        email: `new_test${test_env}@example.com`,
        password: 'test',
    };
    const res = await request(app)
        .post('/api/users')
        .send(payload);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.res.user_id).toBeDefined();
        expect(res.body.data.token).toBeDefined();


        return {
            test_user_id: res.body.data.res.user_id,
            test_token: res.body.data.token,
            user_email: res.body.data.res.email,
        }
};

// DELETE users via token provided
async function deleteTestUser(test_token) {
    const res = await request(app)
    .delete('/api/users')
    .set('Authorization', `Bearer ${test_token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
};

module.exports = {
    createTestUser, 
    deleteTestUser
};