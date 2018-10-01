module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/packages/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/index.ts',
        '!**/impl.ts',
        '!**/types.ts',
        '!**/build/**',
        '!**/node_modules/**',
    ],
    testEnvironment: 'jsdom', // some of the packages (semui and antd) need `window`
    // we have to list all roots here, else the heuristics which tests to run in watch mode does not work
    roots: [
        'packages/antd',
        'packages/moxb',
        'packages/meteor',
        'packages/semui',
    ],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],
    testMatch: [
        '**/src/**/__tests__/*.(ts|tsx)',
    ],
    setupTestFrameworkScriptFile: './jest/jestAdapter.js',
    transform: {
        '^.+\\.(css|less)$': './jest/jestMockStyle.js',
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    modulePaths: [
        '<rootDir>/node_modules'
    ],
};
