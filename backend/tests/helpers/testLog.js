const request = require('supertest');
const app = require('../../app');
const { formatDate } = require('../../../shared/functions/formatting');

async function createTestLog(test_token) {
    const res = await request(app)
        .post('/api/daily_logs')
        .query({ date: new Date(Date.now()) })
        .set('Authorization', `Bearer ${test_token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);


    return log_id = res.body.data.log_id;
};

async function deleteTestLog(log_id, test_token) {
    const res = await request(app)
        .delete(`/api/daily_logs/${log_id}`)
        .set('Authorization', `Bearer ${test_token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
};

module.exports = {
    createTestLog,
    deleteTestLog,
};