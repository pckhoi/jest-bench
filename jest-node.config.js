const config = require("./jest.config");

module.exports = {
  ...config,
  testEnvironmentOptions: {
    testEnvironment: "jest-environment-node",
  },
};
