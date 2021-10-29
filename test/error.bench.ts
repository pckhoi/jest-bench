import { benchmarkSuite } from "../src";
import {expect} from "@jest/globals";

benchmarkSuite("error", {
  ["should throw error"]: () => {
    expect(() => { throw new Error("something wrong!") }).toThrow();
  },
});
