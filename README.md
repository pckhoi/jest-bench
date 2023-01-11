![version](https://img.shields.io/npm/v/jest-bench)
![downloads](https://img.shields.io/npm/dw/jest-bench)

# Jest-Bench

Run benchmark with Jest. Write benchmark files along with your test files, and benchmark using any existing test environment you're using. This package builds on top of the excellent [benchmark](https://www.npmjs.com/package/benchmark) package.

## Which version to install

Some environments such as `jest-electron` are only useable with Jest version less than 27, therefore this package takes its version after Jest version for easy installation:

| Jest version | Jest-Bench version |
| ------------ | ------------------ |
| 29.x.x       | 29.x.x             |
| 28.x.x       | 28.x.x             |
| 27.x.x       | 27.x.x             |
| 26.x.x       | 26.x.x             |

For contributors, branch `main` works with Jest version 29.

## How to use

Install

```bash
npm i -D jest-bench
```

Create a jest config file just for running benchmarks. You can use names such as `jest-bench.config.json`.

```javascript
{
  // Jest-bench need its own test environment to function
  "testEnvironment": "jest-bench/environment",
  "testEnvironmentOptions": {
    // still Jest-bench environment will run your environment if you specify it here
    "testEnvironment": "jest-environment-node",
    "testEnvironmentOptions": {
      // specify any option for your environment
    }
  },
  // always include "default" reporter along with Jest-bench reporter
  // for error reporting
  "reporters": ["default", "jest-bench/reporter"],
  // will pick up "*.bench.js" files or files in "__benchmarks__" folder.
  "testRegex": "(/__benchmarks__/.*|\\.bench)\\.(ts|tsx|js)$",
  ...
}
```

Now any files with names that match `*.bench.js`, or are inside `__benchmarks__` folder will be considered benchmark files. More examples:

- [jest-jsdom.config.ts](jest-jsdom.config.ts)
- [jest-node.config.ts](jest-node.config.ts)

```javascript
import { benchmarkSuite } from "jest-bench";

let a;

benchmarkSuite("sample", {
  // setup will not run just once, it will run for each loop
  setup() {
    a = [...Array(10e6).keys()];
  },

  // same thing with teardown
  teardown() {
    if (a.length < 10e6) a.unshift(0);
  },

  ["Array.indexOf"]: () => {
    a.indexOf(555599);
  },

  ["delete Array[i]"]: () => {
    expect(a.length).toEqual(10e6);
    delete a[0];
  },

  ["Array.unshift"]: () => {
    a.unshift(-1);
  },

  ["Array.push"]: () => {
    a.push(1000000);
  },

  ["Async test"]: (deferred) => {
    // Call deferred.resolve() at the end of the test.
    new Promise((resolve) => setTimeout(resolve, 10)).then(() => deferred.resolve());
  },
});
```

To see more examples, check out the `test` folder. You can now run benchmarks like this:

```bash
npx jest --projects jest-bench.config.json
```

Jest-bench saves benchmark results to `benchmarks/result.txt` in addition to being printed, so you might want to add this folder to .gitignore.

```bash
# .gitignore
benchmarks/result.txt
```

## Reference

### benchmarkSuite(name, description[, timeoutMsOrOptions])

Create and run a new suite. Each suite creates and is associated with a `describe` block underneath.

- **name**: string, name of suite.
- **description**: object, an object with each key represents a single benchmark. Behind the scene, each benchmark runs in a `test` block. You can also write jest assertions, even though doing so makes little sense as it will affect benchmark results. Special keys include:
  - **setup**: run before each loop of benchmark. Note that this and `teardown` are evaled together with the benchmark. So once you declare this, any variable defined outside of `setup` and `teardown` becomes invisible to the benchmark. If this and `teardown` are not defined then benchmarks will still be able to see variables in outer scopes.
  - **teardown**: run after each loop of benchmark. Note the caveat above.
  - **setupSuite**: run once before all benchmarks. This block, in effect, is the same as a `beforeAll` block (and it does call `beforeAll` underneath). Again you probably don't want to define or initialize variables here if you also include `setup` or `teardown`.
  - **teardownSuite**: run once after all benchmarks have concluded.
- **timeoutMsOrOptions**: 
  - number of milliseconds before a benchmark timeouts. Default to 60000,
  - or a `SuiteOptions`:
    - `delay`, `initCount`, `maxTime`, `minSamples`, `minTime` are passed to Benchmark. See the [documentation](https://benchmarkjs.com/docs/#options) for more info.
    - `timeoutSeconds` is the number of seconds before a benchmark timeouts. Default to 60.
