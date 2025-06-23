import tracer from "dd-trace";

tracer.init({
  service: "my-node-service",
  env: "development",
  logInjection: true,
  profiling: true,
});
