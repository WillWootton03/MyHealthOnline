const request = require('supertest');
const app = require('../../app');  

async function createTestCustomExercise(test_token) {
    const res = await request(app)
        .post('/api/exercises/custom_exercise')
        .set('Authorization', `Bearer ${test_token}`)
        .send({
            custom_exercise: {
                name: 'test',
                description: 'test',
                category: 'Legs',
            }
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    return custom_exercise_id = res.body.data.custom_exercise_id;
}

async function deleteTestCustomExercise(test_token, custom_exercise_id) {
    const res = await request(app)
        .delete(`/api/exercises/custom_exercise/${custom_exercise_id}`)
        .set('Authorization', `Bearer ${test_token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
}

module.exports = {
    createTestCustomExercise,
    deleteTestCustomExercise,
}