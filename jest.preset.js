const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  clearMocks: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'environment.*',
    '.mock.ts',
    '.model.ts',
  ],
  coverageReporters: ['html', 'cobertura', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  reporters: ['default'],
  restoreMocks: true
};
