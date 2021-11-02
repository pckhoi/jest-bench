import { benchmarkSuite } from "../dist";

let a: number[];
let b: string[];

const digits = "0123456789";
const asciiLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const RANDS_CHARS = asciiLetters + digits;
const randsArray = (nchars: number, size: number) => {
  const n = RANDS_CHARS.length;
  return Array(size)
    .fill(0)
    .map(() =>
      Array(nchars)
        .fill(0)
        .map(() => RANDS_CHARS[Math.floor(Math.random() * n)])
        .join("")
    );
};

benchmarkSuite("setup teardown", {
  setup() {
    a = [...Array(1e4).keys()];
  },

  teardown() {
    if (a.length < 1e4) a.unshift(0);
  },

  ["Array.indexOf"]: () => {
    a.indexOf(555599);
  },

  ["delete Array[i]"]: () => {
    expect(a.length).toEqual(1e4);
    delete a[0];
  },

  ["Array.unshift"]: () => {
    a.unshift(-1);
  },

  ["Array.push"]: () => {
    a.push(1000000);
  },
});

benchmarkSuite("setupSuite", {
  setupSuite() {
    b = randsArray(3, 1e4);
  },

  teardownSuite() {
    expect(b).toHaveLength(1e4);
  },

  ["Array.indexOf"]: () => {
    b.indexOf("abc");
  },
});
