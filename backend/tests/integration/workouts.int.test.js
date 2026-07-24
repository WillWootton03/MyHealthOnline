const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

const { pool } = require('../../app_server/db/db_connection');
const { createTestUser, deleteTestUser } = require('../helpers/testUser');
const { createTestLog } = require('../helpers/testLog');

let test_token = null;
let test_log_id = null;

beforeAll(async() => {
    const user = await createTestUser('workouts');
    test_token = user.test_token;
    test_log_id = await createTestLog(test_token);
});

afterAll(async() => {
    await deleteTestUser(test_token);
});

describe('All Workout Route Integration Tests', () => {
    // Valid inputs for int test
    describe('Valid inputs for routes', () => {
        // valid new workout with 1 exercise and 1 set
        // Create a workout containing single exercise and single set
        it('Create a workout containing single exercise and single set', async() => {
            // set and exercise use exercise_id so needs to be a variable
            const exercise_id = crypto.randomUUID();

            const res = await request(app)
                .post(`/api/workouts`)
                .set('Authorization', `Bearer ${test_token}`)
                .send({
                    workout: {
                        id: crypto.randomUUID(),
                        startTime: new Date(),
                        log_id: test_log_id,
                        exercises : [
                            {
                                id: exercise_id,
                                name: '1 Leg Box Squat',
                                category: 'Legs',
                                totalWeight: 20,
                                totalReps: 2,
                                exercise_id: 1948,
                                sets: [
                                    {
                                        id: crypto.randomUUID(),
                                        weight: 10,
                                        reps: 2,
                                        restTime: 60,
                                        exercise_id: exercise_id,
                                    }
                                ]
                            }
                        ]
                    }
                });
        
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
        });
    });
    // Invalid inputs for int test
    describe('Invalid inputs for routes', () => {
        // Send workout with 1 exercise without any sets
        it('Send workout with 1 exercise without any sets', async() => {
            const res = await request(app)
                .post(`/api/workouts`)
                .set('Authorization', `Bearer ${test_token}`)
                .send({
                    workout: {
                        id: crypto.randomUUID(),
                        startTime: new Date(),
                        log_id: test_log_id,
                        exercises : [
                            {
                                id: crypto.randomUUID(),
                                name: '1 Leg Box Squat',
                                category: 'Legs',
                                totalWeight: 20,
                                totalReps: 2,
                                exercise_id: 1948,
                                sets: []
                            }
                        ]
                    }
                });
        
                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
        });
    });
    // Auth fail checks for routes
    describe('Authorization validation checks', () => {
        // Send valid workout without token present
        it('Send valid workout without token present', async() => {
            const exercise_id = crypto.randomUUID();
            const res = await request(app)
                .post(`/api/workouts`)
                .send({
                    workout: {
                        id: crypto.randomUUID(),
                        startTime: new Date(),
                        log_id: test_log_id,
                        exercises : [
                            {
                                id: exercise_id,
                                name: '1 Leg Box Squat',
                                category: 'Legs',
                                totalWeight: 20,
                                totalReps: 2,
                                exercise_id: 1948,
                                sets: [
                                    {
                                        id: crypto.randomUUID(),
                                        weight: 10,
                                        reps: 2,
                                        restTime: 60,
                                        exercise_id: exercise_id,
                                    }
                                ]
                            }
                        ]
                    }
                });
        
                expect(res.statusCode).toBe(401);
                expect(res.body.success).toBe(false);
        });
    });
});