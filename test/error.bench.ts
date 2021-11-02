import { benchmarkSuite } from "../dist";

benchmarkSuite("error", {
  ["should throw error"]: () => {
    throw new Error("something wrong!");
  },
});
