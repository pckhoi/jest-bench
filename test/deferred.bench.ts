import { Deferred } from "benchmark";
import { benchmarkSuite } from "../dist";

benchmarkSuite("deferred", {
  ["deferred"]: (deferred: Deferred) => {
    new Promise((resolve) => setTimeout(resolve, 10)).then(() => deferred.resolve());
  },
});
