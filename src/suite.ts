import Benchmark from "./benchmark";
import { saveResult } from "./store";
import { Deferred } from 'benchmark';

export type SuiteDescription = {
  setup?: (() => Promise<void> | void),
  teardown?: (() => Promise<void> | void),
  setupSuite?: (() => Promise<void> | void),
  teardownSuite?: (() => Promise<void> | void),
  [key: string]: (() => Promise<void> | void) | ((deferred: Deferred) => Promise<void> | void) | undefined;
};

export const benchmarkSuite = (name: string, desc: SuiteDescription, timeout = 60000) => {
  describe(name, () => {
    const { setup, teardown, setupSuite, teardownSuite } = desc;
    if (setupSuite) {
      beforeAll(setupSuite);
    }
    if (teardownSuite) {
      afterAll(teardownSuite);
    }
    for (let key of Object.keys(desc)) {
      if (["setup", "teardown", "setupSuite", "teardownSuite"].indexOf(key) !== -1) {
        continue;
      } else {
        const fn = desc[key] as () => Promise<void> | void;
        test(
          key,
          () =>
            new Promise((resolve, reject) => {
              const bm = Benchmark(key, {
                defer: fn.length === 1,
                setup,
                fn,
                teardown,
                onComplete: () => {
                  saveResult(name, key, {
                    stats: bm.stats,
                    times: bm.times,
                    count: bm.count,
                    cycles: bm.cycles,
                    hz: bm.hz,
                  });
                  resolve(null);
                },
                onError: () => {
                  reject(bm.error);
                },
              });
              bm.run({ async: true });
            }),
          timeout
        );
      }
    }
  });
};
