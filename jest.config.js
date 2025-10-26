module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tools', '<rootDir>/src/engine'],
  testMatch: ['**/__tests__/**/*.ts', '**/__tests__/**/*.js', '**/?(*.)+(spec|test).ts', '**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'tools/**/*.ts',
    'src/engine/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  preset: 'ts-jest',
};
