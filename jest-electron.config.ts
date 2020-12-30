import config from "./jest.config";

export default {
  ...config,
  runner: "jest-electron/runner",
  testEnvironmentOptions: {
    testEnvironment: "jest-electron/environment",
  },
};
