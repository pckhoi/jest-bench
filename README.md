# Jest-Bench

Run benchmark with Jest, write benchmark files along your test files and benchmark using any existing test environment you're using. This package rely on the excellent `benchmark` package to function.

## Which version to install

Some environments such as `jest-electron` are only useable with Jest version 27, therefore this package take its version after jest version for easy installation:

| Jest version | Jest-Bench version |
| ------------ | ------------------ |
| 26.x.x       | 26.x.x             |
| 27.x.x       | 27.x.x             |

For contributors, branch `main` works with Jest version 27, while branch `v26` works with Jest version 26.

## How to use

Install

```bash
npm i -D jest-bench
```

Create a jest config file just for running benchmarks. You can use name such as `jest-bench.config.json`.

```javascript
{
  // Jest-bench need its own test environemtn to function
  "testEnvironment": "jest-bench/environment",
  "testEnvironmentOptions": {
    // still Jest-bench environment will run your environment if you specify it here
    "testEnvironment": "jest-environment-jsdom",
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

To see more examples, look at `jest-*.config.ts` files. You can now write your benchmark files with name `*.bench.js` or save them in `__benchmarks__` folder.

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
});
```

To see more examples, check out `test` folder. You can now run benchmarks like this:

```bash
npx jest --projects jest-bench.config.json
```

Benchmark results are output to `benchmarks/result.txt` in addition to being print so you might want to add that to .gitignore.

```bash
# .gitignore
benchmarks/result.txt
```

## Reference

### benchmarkSuite(name, description[, timeout])

Create and run a new suite. Each suite create and is associated with a `describe` block underneath.

- **name**: string, name of suite.
- **description**: object, an object with each key represent a single benchmark. Behind the scene each benchmark run in a `test` block therefore you can also write jest assertion, even though it makes little sense to do so as it will affect benchmark result. Special keys include:
  - **setup**: run before each loop of benchmark. Note that this along with `teardown` are evaled together with the benchmark so once you declare this, any variable defined outside of `setup` and `teardown` become invisible to the benchmark. If this and `teardown` are not defined then benchmarks will still be able to see variables in outer scopes.
  - **teardown**: run after each loop of benchmark. Note the caveat above.
  - **setupSuite**: run once before all benchmarks. This in effect is the same as a `beforeAll` block (and it does call `beforeAll` underneath). Again you probably don't want to define or initialize variables here if you also include `setup` or `teardown`.
  - **teardownSuite**: run once after all benchmarks have concluded.
- **timeout**: number of milliseconds before a benchmark timeout. Default to 60000.
