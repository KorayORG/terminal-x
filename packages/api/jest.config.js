module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^@terminal-x/shared$': '<rootDir>/../shared/src',
    '^@terminal-x/shared/(.*)$': '<rootDir>/../shared/src/$1',
  },
};
