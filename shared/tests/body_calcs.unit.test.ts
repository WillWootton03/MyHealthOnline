import {describe, expect, it} from '@jest/globals';
import { getBMR, getCalorieChange, getTDEE } from '../functions/body_calcs';

describe('Valid inputs for body calcs', () =>{
    it('getBMR should return 1700 < x < 1750', () =>{
        const res = getBMR(180, 72, 25, 'male');
        expect(res).toBeGreaterThan(1700);
        expect(res).toBeLessThan(1750);
    });
    it('getTDEE should be 2650 < x < 2700', () => {
        const res = getTDEE(getBMR(180, 72, 25, 'male'), 3);

        expect(res).toBeGreaterThan(2650);
        expect(res).toBeLessThan(2700);
    });
    it('getCalorieChange should return correct value for losing weight over 12 months imperial measurement', async() => {
        expect(getCalorieChange(200, 180, 360, 'imperal')).toBeLessThan(-192);
        expect(getCalorieChange(180, 200, 360, 'imperial')).toBeGreaterThan(-195);
    });
    it('getCalorieChange should return 192 for gaining weight over 12 months imperial measurement', async() => {
        expect(getCalorieChange(180, 200, 360, 'imperial')).toBeGreaterThan(190);
        expect(getCalorieChange(180, 200, 360, 'imperial')).toBeLessThan(195);
    });
        it('getCalorieChange should return correct value for losing weight over 12 months metric measurement', async() => {
        expect(getCalorieChange(90.72, 81.65, 360, 'imperal')).toBeLessThan(-192);
        expect(getCalorieChange(90.72, 81.65, 360, 'imperial')).toBeGreaterThan(-195);
    });
    it('getCalorieChange should return 192 for gaining weight over 12 months metric measurement', async() => {
        expect(getCalorieChange(81.65, 90.72, 360, 'metric')).toBeGreaterThan(190);
        expect(getCalorieChange(81.65, 90.72, 360, 'metric')).toBeLessThan(195);
    });
});