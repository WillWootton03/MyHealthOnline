import {describe, expect, it} from '@jest/globals';
import { feetToCm, cmToFeetString, lbsToKg, kgToLbs } from '../functions/int_conversions';

describe('Verify feetToCm', () => {
    it('Should return 178', () => {
        expect(feetToCm(5, 10));
    });
});
describe('Verify cmToFeetString', () => {
    it("Should return 5'10", () =>{
        expect(cmToFeetString(178)).toBe("5'10");
    });
});
describe('Verify lbsToKg', () => {
    it('Should return 82', () => {
        expect(lbsToKg(180)).toBe(82);
    });
});
describe('Verify kgToLbs', () => {
    it('Should return 180', () => {
        expect(kgToLbs(81.6466)).toBe(180);
    });
});