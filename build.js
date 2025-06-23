const { build } = require("esbuild");
const ddPlugin = require("dd-trace/esbuild");

build({
  outdir: "dist/",
  entryPoints: [
    { in: "src/init-instrumentation.ts", out: "init-instrumentation" },
    { in: "src/index.ts", out: "main" },
  ],
  bundle: true,
  platform: "node",
  format: "cjs",
  minify: true,
  external: [
    // esbuild cannot bundle native modules
    "@datadog/native-metrics",

    // required if you use profiling
    "@datadog/pprof",

    // required if you use Datadog security features
    "@datadog/native-appsec",
    "@datadog/native-iast-taint-tracking",
    "@datadog/native-iast-rewriter",

    // required if you encounter graphql errors during the build step
    "graphql/language/visitor",
    "graphql/language/printer",
    "graphql/utilities",
  ],
  sourcemap: true,
  logLevel: "info",
  plugins: [ddPlugin],
});
