const request = require('supertest');
const app = require('../../app');

async function createTestMeal(log_id, test_token, meal_type = 'breakfast') {
    const res = await request(app)
        .post('/api/meals')
        .send({ log_id, meal_type })
        .set('Authorization', `Bearer ${test_token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);


    return res.body.data.meal_id;
};

module.exports = {
    createTestMeal
}