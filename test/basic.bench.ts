import { benchmarkSuite } from "../dist";

benchmarkSuite(
  "regexp",
  {
    ["test"]: () => {
      /o/.test("Hello World!");
    },
  },
  10000
);

benchmarkSuite("string", {
  ["indexOf"]: () => {
    "Hello World!".indexOf("o") > -1;
  },

  ["match"]: () => {
    !!"Hello World!".match(/o/);
  },
});

benchmarkSuite("string with SuiteOptions", {
  ["indexOf"]: () => {
    "Hello World!".indexOf("o") > -1;
  },

  ["match"]: () => {
    !!"Hello World!".match(/o/);
  },
}, { delay: 0.1, maxTime: 0.5, timeoutSeconds: 10 });