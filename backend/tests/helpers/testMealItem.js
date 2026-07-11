const request = require('supertest');
const app = require('../../app');    

async function createTestMealItem(log_id, meal_id, test_token) {
    const res = await request(app)
        .post('/api/meal_items')
        .send({
                log_id: log_id,
                meal_id: meal_id,
                fdc_id: '2055557',
                food_name: 'Industrias Alimenticias Noel CRACKERS',
                brand_owner: 'Industrias Alimenticias Noel',
                serving_size: 27.799999237060547,
                serving_amount: 1,
                household_serving: '3 CRACKERS',
                serving_unit: '3 CRACKERS',
                macros: { calories: 468, protein: 7.19, fat: 21.6, carbohydrates: 57.6 }
          })
        .set('Authorization', `Bearer ${test_token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
        

        return res.body.data.meal_item_id;
};

module.exports = {
    createTestMealItem,
}