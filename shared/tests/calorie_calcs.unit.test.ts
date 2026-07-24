import {describe, expect, it} from '@jest/globals';
import { calculateMacroNutrients } from '../functions/calorie_calcs'

describe('Valid input for macronutrient calculations', () => {
    it('Should return 130', () => {
        expect(calculateMacroNutrients(468, '3 CRACKERS', 1, 27.799999237060547, '3 CRACKERS')).toBe(130);
    });
    it('Should return 468', () => {
        expect(calculateMacroNutrients(468, '100 g', 1)).toBe(468);
    });
    it('Should return 5', () => {
        expect(calculateMacroNutrients(468, '1 g', 1)).toBe(5);
    });
    it('Should return 43', () => {
        expect(calculateMacroNutrients(468, '1 CRACKER', 1, 27.799999237060547, '3 CRACKERS')).toBe(43);
    })
    it('Should return 0', () => {
        expect(calculateMacroNutrients(468, '100 g', 0)).toBe(0);
    });    
});
describe('Invalid inputs for values', () => {
    it('Should return 0', () => {
        expect(calculateMacroNutrients(468, '100 g', -1)).toBe(0);
    });
    it('Should return 0', () => {
        expect(calculateMacroNutrients(0, '100 g', 1)).toBe(0);
    });
    it('Should return 0', () => {
        expect(calculateMacroNutrients(468, 'none', 1)).toBe(0);
    });
    it('Should return -0', () => {
        expect(calculateMacroNutrients(468, '100 g', -1)).toBe(0);
    });
    it('Should return 0', () => {
        expect(calculateMacroNutrients(468, '3 fake', 1)).toBe(0);
    });
    it('Should return 0', () => {
        expect(calculateMacroNutrients(468, '3 fake', 1, 27.799999237060547, '3 CRACKERS')).toBe(0);
    });
});
