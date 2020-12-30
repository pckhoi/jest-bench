const key = "jestBenchmarkStore";

export const createStore = (glob: any) => {
  glob[key] = {};
};

export const getStore = (glob: any) => glob[key];

export const saveResult = (suiteName: string, benchName: string, result: any) => {
  const store = getStore(global);
  if (!store[suiteName]) {
    store[suiteName] = [];
  }
  store[suiteName].push([benchName, result]);
};
