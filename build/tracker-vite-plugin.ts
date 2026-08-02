import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

const publicId = "virtual:product-tracker";
const resolvedId = `\0${publicId}`;

export function productTracker(): Plugin {
  let root = process.cwd();

  return {
    name: "product-tracker-markdown",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === publicId ? resolvedId : undefined;
    },
    async load(id) {
      if (id !== resolvedId) return undefined;
      const trackerPath = resolve(root, "PRODUCT_TRACKER.md");
      this.addWatchFile(trackerPath);
      const markdown = await readFile(trackerPath, "utf8");
      return `export default ${JSON.stringify(markdown)};`;
    },
  };
}

