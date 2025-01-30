import { performance } from "node:perf_hooks";
import * as v8 from "node:v8";
import { HtmlParser2Parser } from "./htmlparser2/parser.js";
import { JsdomParser } from "./jsdom/parser.js";
import * as fs from "node:fs";

if (process.argv.length < 4) {
  console.error(
    `Usage: node ${process.argv[1]} (jsdom|htmlparser2) <infile> [<outfile>]`,
  );
  process.exit(1);
}

const method = process.argv[2];
if (method !== "jsdom" && method !== "htmlparser2") {
  console.error(
    `Usage: node ${process.argv[1]} (jsdom|htmlparser2) <infile> [<outfile>]`,
  );
  process.exit(1);
}

const start = performance.now();
const beforeMemory = {
  heapUsed: Math.floor(process.memoryUsage().heapUsed / 1000),
  heapTotal: Math.floor(process.memoryUsage().heapTotal / 1000),
  external: Math.floor(process.memoryUsage().external / 1000),
  v8heap: Math.floor(v8.getHeapStatistics().used_heap_size / 1000),
};

const htmlfile = process.argv[3];
let output: string;
switch (method) {
  case "jsdom":
    output = await JsdomParser.replaceImgSrcAttributes(
      htmlfile,
      "replaced-src",
    );
    break;
  case "htmlparser2":
    output = await HtmlParser2Parser.replaceImgSrcAttributes(
      htmlfile,
      "replaced-src",
    );
    break;
  default:
    throw new Error(`${method satisfies never} is invalid`);
}

const end = performance.now();
const afterMemory = {
  heapUsed: Math.floor(process.memoryUsage().heapUsed / 1000),
  heapTotal: Math.floor(process.memoryUsage().heapTotal / 1000),
  external: Math.floor(process.memoryUsage().external / 1000),
  v8heap: Math.floor(v8.getHeapStatistics().used_heap_size / 1000),
};

console.error({
  time: `${end - start}ms`,
  memoryUsage: {
    heapUsed: `${afterMemory.heapUsed - beforeMemory.heapUsed}kb`,
    heapTotal: `${afterMemory.heapTotal - beforeMemory.heapTotal}kb`,
    external: `${afterMemory.external - beforeMemory.external}kb`,
    v8heap: `${afterMemory.v8heap - beforeMemory.v8heap}kb`,
  },
});

if (process.argv.length >= 5) {
  const outfile = process.argv[4];
  fs.writeFileSync(outfile, output);
}
