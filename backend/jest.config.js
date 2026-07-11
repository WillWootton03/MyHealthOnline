const path = require('path');

/** @type {import { 'ts-jest' }.JestConfigWithTsJest} */
module.exports = {
    testEnvironment : 'node',
    // sets jests context to the project root
    rootDir: '.',

    // Tells jest to look for tests in backend and shared
    roots: [
        '<rootDir>',
        '<rootDir>/../shared'
    ],

    transform: {
        '^.+\\.tsx?$': [
            require.resolve('ts-jest'),
            {
                tsconfig: path.resolve(__dirname, 'tsconfig.test.json'),
            },
        ],
    },
};