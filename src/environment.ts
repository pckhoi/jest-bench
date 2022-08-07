import * as fs from "fs";
import * as path from "path";
import { Config, Circus, Global } from "@jest/types";
import { EnvironmentContext } from "@jest/environment";

import { createStore, getStore } from "./store";

type BenchmarkConfig = Partial<Pick<Config.ProjectConfig, "testEnvironment" | "testEnvironmentOptions">>

type ConstructorConfig = {
  projectConfig: Config.ProjectConfig & {testEnvironmentOptions?: BenchmarkConfig };
  globalConfig: Config.GlobalConfig;
}

export default class BenchmarkEnvironment {
  env: any;
  global: Global.Global | null;
  moduleMocker: any;
  fakeTimers: any;
  fakeTimersModern: any;

  constructor(config: ConstructorConfig, context?: EnvironmentContext) {
    const { testEnvironment, testEnvironmentOptions } = config.projectConfig.testEnvironmentOptions;
    let envModule = testEnvironment || "jest-environment-jsdom";
    if (envModule === "jsdom") {
      envModule = "jest-environment-jsdom";
    }
    if (envModule === "node") {
      envModule = "jest-environment-node";
    }
    config = {
      ...config,
      projectConfig: {
        ...config.projectConfig,
        testEnvironment: envModule,
        testEnvironmentOptions: testEnvironmentOptions || {},
      }
    };
    const clsImport = require(envModule);
    const cls = clsImport.default ?? clsImport
    const env = new cls(config, context);

    this.global = env.global || global;
    createStore(this.global);
    this.fakeTimers = env.fakeTimers || null;
    this.moduleMocker = env.moduleMocker || null;
    this.fakeTimersModern = env.fakeTimersModern || null;
    if (env.getVmContext) {
      function getVmContext() {
        return env.getVmContext();
      }
      Object.defineProperty(this, "getVmContext", {
        value: getVmContext.bind(this),
        writable: false,
      });
    }
    if (env.handleTestEvent) {
      function handleTestEvent(event: Circus.Event, state: Circus.State) {
        return env.handleTestEvent(event, state);
      }
      Object.defineProperty(this, "handleTestEvent", {
        value: handleTestEvent.bind(this),
        writable: false,
      });
    }
    this.env = env;
  }

  async setup() {
    await this.env.setup();
  }

  get resultFile() {
    return path.join(process.cwd(), "benchmarks", "result.txt");
  }

  async teardown() {
    const store = getStore(this.global);
    const folder = path.join(process.cwd(), "benchmarks");
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    const fileName = this.resultFile;
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, "");
    }
    fs.appendFileSync(fileName, "\n" + JSON.stringify(store));

    await this.env.teardown();
    this.global = null;
    this.fakeTimers = null;
    this.fakeTimersModern = null;
  }

  runScript(script: any) {
    return this.env.runScript(script);
  }
}
