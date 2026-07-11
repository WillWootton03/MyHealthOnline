import {describe, expect, it} from '@jest/globals';
import { getBMR, getTDEE } from '../functions/body_calcs';

describe('Valid inputs for body calcs', () =>{
    it('Should return 1700 < x < 1750', () =>{
        const res = getBMR(180, 72, 25, 'male');
        expect(res).toBeGreaterThan(1700);
        expect(res).toBeLessThan(1750);
    });
    it('Should return 2650 < x < 2700', () => {
        const res = getTDEE(getBMR(180, 72, 25, 'male'), 3);

        expect(res).toBeGreaterThan(2650);
        expect(res).toBeLessThan(2700);
    });
});