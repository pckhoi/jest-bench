module.exports = {
  preset: "ts-jest",
  coverageProvider: "v8",
  testEnvironment: "./environment.js",
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/test/"],
  collectCoverageFrom: ["src/**/*.ts"],
  testRegex: "(/__benchmarks__/.*|(\\.|/)bench)\\.[jt]sx?$",
  reporters: ["default", "./reporter.js"],
};
