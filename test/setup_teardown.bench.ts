import { benchmarkSuite } from "../dist";

let a: number[];

benchmarkSuite("setup teardown", {
  setup() {
    a = [...Array(10e6).keys()];
  },

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
