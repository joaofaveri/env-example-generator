/** @type {import('ts-jest').JestConfigWithTsJest} **/
import type { Config } from 'jest'

const config: Config = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  }
}

export default config
