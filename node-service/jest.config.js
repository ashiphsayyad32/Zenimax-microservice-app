module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'config/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true
};
