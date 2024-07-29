const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: ["./server/index.js"],
    bundle: true,
    platform: "node",
    target: "node21",
    outfile: path.resolve(__dirname, "dist/index.js"),
    sourcemap: true,
    minify: true,
    external: [
      "bcrypt",
      "cors",
      "dotenv",
      "express",
      "jsonwebtoken",
      "pg",
      "uuid",
    ],
  })
  .catch(() => process.exit(1));
