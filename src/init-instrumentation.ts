import tracer from "dd-trace";

// doesn't help
// tracer.use("openai", {enabled: false});

tracer.init({
  service: "my-node-service",
  env: "development",
  logInjection: true,
  profiling: true,
});
