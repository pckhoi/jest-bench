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
