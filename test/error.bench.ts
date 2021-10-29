import { benchmarkSuite } from "../src";

benchmarkSuite("error", {
  ["should throw error"]: () => {
    throw new Error("something wrong!");
  },
});
