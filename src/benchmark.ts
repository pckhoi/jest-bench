import _ from "lodash";
import Benchmark from "benchmark";

// avoid `Cannot read property 'parentNode' of undefined` error in runScript
if (global.document !== undefined && global.document.getElementsByTagName("script").length === 0) {
  const script = global.document.createElement("script");
  global.document.body.appendChild(script);
}

// Benchmark could not pick up lodash otherwise
const bm = Benchmark.runInContext({ _ });

// avoid `ReferenceError: Benchmark is not defined` error because Benchmark is assumed to be in window
if (global.window !== undefined) {
  const win = global.window as any;
  win.Benchmark = bm;
} else {
  const glob = global as any;
  glob.Benchmark = bm;
}

export default bm;
