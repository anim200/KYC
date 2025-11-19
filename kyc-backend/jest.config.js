module.exports = {
  preset: "ts-jest",  // Use the ts-jest preset to handle TypeScript files
  testEnvironment: "node",  // Set the environment to Node for server-side testing
  testMatch: [
    "<rootDir>/src/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.ts"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"  // Adjust according to your directory structure if needed
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,  // This improves speed, but you can remove this if you face issues
    },
  },
};
