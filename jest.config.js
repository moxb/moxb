module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'packages/src/*.{ts}',
        'packages/src/*.{tsx}',
        '!**/*.d.ts',
        '!**/build/**',
        '!**/node_modules/**',
    ],
    testEnvironment: "node",
    // we have to list all roots here, else the heuristics which tests to run in watch mode does not work
    roots: [
        'packages/antd',
        'packages/moxb',
        'packages/meteor',
        'packages/semui',
    ],
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testMatch: [
        "**/src/**/__tests__/*.(ts|tsx)",
    ],
    setupTestFrameworkScriptFile: "./jest/jestAdapter.js",
    transform: {
        "^.+\\.(css|less)$": "./jest/jestMockStyle.js",
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    modulePaths: [
        "<rootDir>/node_modules"
    ],
};
