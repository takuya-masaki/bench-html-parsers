import { JSDOM } from "jsdom";
import * as fs from "node:fs";

export class JsdomParser {
  static async replaceImgSrcAttributes(
    filename: string,
    replacement: string,
  ): Promise<string> {
    const content = fs.readFileSync(filename, "utf8");

    // JSDOMがnextTickを呼ぶことに起因してメモリリークが起こり得るため
    // あえて非同期に実行することでメモリリークを回避する
    // cf. https://github.com/jsdom/jsdom/issues/1665
    return await new Promise<string>((resolve, reject) => {
      setImmediate(async () => {
        try {
          const contentDom = new JSDOM(content);
          const contentDoc = contentDom.window.document;

          const imageTags = contentDoc.querySelectorAll("img");
          for (const imageTag of imageTags) {
            const targetSrc = imageTag.attributes.getNamedItem("src");
            if (!targetSrc?.textContent) {
              continue;
            }
            targetSrc.textContent = replacement;
          }

          resolve(contentDom.serialize());
        } catch (e: unknown) {
          reject(e);
        }
      });
    });
  }
}
