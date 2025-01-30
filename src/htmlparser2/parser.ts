import { Parser } from "htmlparser2";
import * as fs from "node:fs";

export class HtmlParser2Parser {
  static async replaceImgSrcAttributes(
    filename: string,
    replacement: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputChunks: string[] = [];

      const parser = new Parser({
        onopentag(name: string, attributes: { [s: string]: string }) {
          outputChunks.push(`<${name}`);

          for (const key in attributes) {
            if (name === "img" && key === "src") {
              outputChunks.push(` src="${replacement}"`);
            } else {
              outputChunks.push(` ${key}="${attributes[key]}"`);
            }
          }

          outputChunks.push(`>`);
        },

        onclosetag(name: string) {
          outputChunks.push(`</${name}>`);
        },

        ontext(data: string) {
          outputChunks.push(data);
        },

        oncomment(data: string) {
          outputChunks.push(`<!--${data}-->`);
        },

        onprocessinginstruction(_name: string, data: string) {
          outputChunks.push(`<${data}>`);
        },
      });

      const htmlStream = fs.createReadStream(filename, {
        encoding: "utf8",
        highWaterMark: 64,
      });

      htmlStream.on("data", (chunk: Buffer | string) => {
        parser.write(chunk.toString());
      });

      htmlStream.on("error", (err: Error) => {
        parser.end();
        reject(err);
      });

      htmlStream.on("end", () => {
        parser.end();
        resolve(outputChunks.join(""));
      });
    });
  }
}
