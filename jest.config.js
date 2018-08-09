module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'packages/**/*.{js}',
        '!**/node_modules/**',
    ],
    testEnvironment: "node",
    roots: [
        'packages/',
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
