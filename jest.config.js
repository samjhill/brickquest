module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tools', '<rootDir>/src/engine'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        compilerOptions: {
          module: 'commonjs',
          esModuleInterop: true,
          skipLibCheck: true,
        }
      }
    }],
  },
  collectCoverageFrom: [
    'tools/**/*.ts',
    'src/engine/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
