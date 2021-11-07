module.export = {
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFileAfterEnd: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: 'jsdom'
}