import * as fs from "fs";
import * as path from "path";

import { BaseReporter } from "@jest/reporters";
import type { Config } from "@jest/types";
import type { AggregatedResult, ReporterOnStartOptions } from "@jest/reporters";
import chalk from "chalk";
import ndjson from "ndjson";

const formatPeriod = (num: number) => {
  if (num < 10e-6) {
    return `${(num * 10e6).toFixed(3)} μs`;
  } else if (num < 10e-3) {
    return `${(num * 10e3).toFixed(3)} ms`;
  } else if (num < 1) {
    return `${(num * 10e3).toFixed(2)} ms`;
  }
  return `${num.toFixed(2)} s`;
};

export default class BenchmarkReporter extends BaseReporter {
  protected _globalConfig: Config.GlobalConfig;

  constructor(globalConfig: Config.GlobalConfig) {
    super();
    this._globalConfig = globalConfig;
  }

  onRunStart(results: AggregatedResult, options: ReporterOnStartOptions): void {
    super.onRunStart(results, options);
    const name = this.resultFile;
    if (fs.existsSync(name)) {
      fs.writeFileSync(name, "");
    }
  }

  get resultFile() {
    return path.join(process.cwd(), "benchmarks", "result.txt");
  }

  onRunComplete(): Promise<void> {
    this.log(`${chalk.bold("Benchmarks:")}`);
    return new Promise((resolve, reject) => {
      fs.createReadStream(this.resultFile)
        .pipe(ndjson.parse())
        .on("data", (obj: Record<string, [string, Record<string, any>][]>) => {
          for (let suiteName in obj) {
            const suite = obj[suiteName];
            this.log(`  ${suiteName}`);
            const lines: string[][] = [];
            for (let [name, bench] of suite) {
              const { stats, times } = bench;
              const { rme, sample } = stats;
              const size = sample.length;
              const { period } = times;
              lines.push([
                name,
                `${chalk.green(formatPeriod(period))} \xb1 ${chalk.cyan(`${rme.toFixed(2)} %`)}`,
                `(${size} run${size == 1 ? "" : "s"} sampled)`,
              ]);
            }
            const maxWidths: number[] = lines.reduce(
              (prev: number[], cur: string[]): number[] =>
                cur.map((v, i): number => {
                  if (!prev[i] || prev[i] < v.length) return v.length;
                  return prev[i];
                }),
              []
            );
            for (let line of lines) {
              this.log("    " + line.map((v, i) => v.padEnd(maxWidths[i])).join("  "));
            }
          }
        })
        .on("error", (error: Error) => {
          reject(error);
        })
        .on("end", () => {
          resolve();
        });
    });
  }
}
