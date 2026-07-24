import {describe, expect, it, test} from '@jest/globals';
import { formatDate, formatTimer, getFeetInchesFromString, getTimeDifferenceInSeconds, getTotSeconds, pluralCheck, titleCase } from '../functions/formatting';

// Verfiies all possibilities for plural strings and singular string inputs
describe('Valid inputs for plural string checks', () => {
    it('Should return potato from potatoes', () => {
        expect(pluralCheck('potatoes')).toBe('potato');
    });
    it("Should return sandwich", () => {
        expect(pluralCheck('sandwiches')).toBe('sandwich');
    });
    it('Should return cracker', () => {
        expect(pluralCheck('crackers')).toBe('cracker');
    });
    it('Should return loaf', () => {
        expect(pluralCheck('loaves')).toBe('loaf');
    });
    it('Should return glass', () => {
        expect(pluralCheck('glasses')).toBe('glass');
    });
    it('Should return str', () => {
        expect(pluralCheck('str')).toBe('str');
    });
    it('Should return 12', () => {
        expect(pluralCheck('12')).toBe('12');
    });
});
// 
describe('Verify titleCase is returned on all types of inputs', () => {
    it('Should return Test', () => {
        expect(titleCase('test')).toBe('Test');
    });
    it('Should return Test Case', () => {
        expect(titleCase('test case')).toBe('Test Case');
    });
    it('Should return Test Case', () => {
        expect(titleCase('test     case')).toBe('Test     Case');
    });
    it('Should return Test', () => {
        expect(titleCase('TEST')).toBe('Test');
    });
    it('Should return Test Case', () => {
        expect(titleCase('TEST CASE')).toBe('Test Case');
    });
    it('Should return 12', () => {
        expect(titleCase('12')).toBe('12');
    });
});
describe('Verify getFeetInchesFromString is returned properly', () => {
    it("Should return fett = 5 and inches = 10", () => {
        const {feet, inches} = getFeetInchesFromString("5'10");
        expect(feet).toBe(5);
        expect(inches).toBe(10);
    });
    it("Should return feet = -1 and inches = -1", () => {
        const {feet, inches} = getFeetInchesFromString("L'l");
        expect(feet).toBe(-1);
        expect(inches).toBe(-1);
    });
});
// dates are 0 indexed for months
describe('Verify formatDate returns properly', () => {
    it('Should return 07-10-2026', () => {
        expect(formatDate(new Date(2026, 6, 10))).toBe('07-10-2026');
    });
});

describe('Verify formatTimer', () => {
    // Formats total seconds into m?m:ss format
    it('Formats total seconds into m?m:ss format', async() => {
        expect(formatTimer(135)).toBe('2:15');
    });
    // Format double digit minutes
    it('Format double digit minutes', async() => {
        expect(formatTimer(620)).toBe("10:20");
    });
    // Format no minutes
    it('Format no minutes', async() => {
        expect(formatTimer(40)).toBe("0:40");
    });
});

describe('Return total seconds from timer string', () => {
    // Return 135 from 2:15 total seconds
    it('Return 135 from 2:15 total seconds', async() => {
        expect(getTotSeconds("2:15")).toBe(135);
    });
    // Return 620 from 10:20 total seconds
    it('Return 620 from 10:20 total seconds', async() => {
        expect(getTotSeconds("10:20")).toBe(620);
    });
    // Return 40 total seconds from 0:40 for no minutes
    it('Return 40 total seconds from 0:40 for no minutes', async() => {
        expect(getTotSeconds("0:40")).toBe(40);
    }); 
});

describe('Return time in total seconds difference from two date times', () => {
    // Get Valid seconds between two times given new Date() objects 10 minutes apart
    it('Get Valid seconds between two times given new Date() objects', async() => {
        const timeThen = new Date("2026-07-24T03:00:00Z");
        const timeNow = new Date("2026-07-24T03:10:00Z")
        expect(getTimeDifferenceInSeconds(timeNow, timeThen)).toBe(600);
    });
});
