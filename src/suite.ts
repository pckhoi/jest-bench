import Benchmark from "./benchmark";
import { saveResult } from "./store";

export type SuiteDescription = {
  [key: string]: (() => Promise<void> | void) | undefined;
};

export const benchmarkSuite = (name: string, desc: SuiteDescription) => {
  describe(name, () => {
    const setup = desc.setup;
    const teardown = desc.teardown;
    for (let key of Object.keys(desc)) {
      const fn = desc[key] as () => Promise<void> | void;
      if (key === "setup" || key === "teardown") {
        continue;
      } else {
        test(
          key,
          () =>
            new Promise((resolve, reject) => {
              const bm = Benchmark(key, {
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
          60000
        );
      }
    }
  });
};
