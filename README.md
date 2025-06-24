
# Datadog Trace Bug Reproduction

This repository demonstrates and reproduces specific issues with the Datadog tracing library (`dd-trace-js`) in Node.js applications. The project is configured to help isolate and test various tracing-related problems, particularly those involving OpenAI instrumentation conflicts and module resolution issues.

https://github.com/DataDog/dd-trace-js/issues/5925#issuecomment-2997220385

## Background

The Datadog Node.js tracing library has encountered several known issues related to OpenAI integration and module bundling:

- **OpenAI Plugin Errors** ([#4574](https://github.com/DataDog/dd-trace-js/issues/4574)): Runtime errors when the OpenAI plugin attempts to trace API calls, causing "Cannot read properties of undefined" exceptions
- **Module Resolution Issues** ([#4424](https://github.com/DataDog/dd-trace-js/issues/4424)): Webpack and bundler failures due to missing `tiktoken` module dependencies, even in projects not using OpenAI
- **Instrumentation Conflicts** ([#5793](https://github.com/DataDog/dd-trace-js/pull/5793)): Version compatibility issues between OpenAI package versions and the Datadog tracing instrumentation

Despite Datadog's [official compatibility documentation](https://docs.datadoghq.com/tracing/trace_collection/compatibility/nodejs/) indicating support for OpenAI v5, real-world bundling scenarios reveal compatibility issues that this reproduction environment helps test and isolate.

This happens despite trying to disable OpenAI tracing, as per the env variables set in the dockerfile.

## Configuration

The application is configured with:
- Datadog tracing with profiling enabled
- OpenAI and DNS instrumentations explicitly disabled
- esbuild bundling with proper external module handling
- Source map support for debugging

## Usage

### Development
```bash
npm install
npm run build
npm start
```

### Docker
```bash
docker build -t dd-trace-bug-repro .
docker run -p 3000:3000 dd-trace-bug-repro
```

The application runs a simple Express server on port 3000 with basic tracing instrumentation.

## Environment Variables

Key Datadog configuration:
- `DD_TRACE_DISABLED_PLUGINS=openai` - Disables problematic plugins (doesn't work)
- `DD_TRACE_DISABLED_INSTRUMENTATIONS=openai` - Disables instrumentations (doesn't work)
- `DD_TRACE_OPENAI_ENABLED=false` - Explicitly disables OpenAI tracing (undocumented but found in plugin_manager.js - doesnt work anyway)
- `DD_TRACE_DEBUG=true` - Enables debug logging

## Files

- `src/index.ts` - Express server with conditional OpenAI usage
- `src/init-instrumentation.ts` - Datadog tracer initialization
- `build.js` - esbuild configuration with external module handling
- `Dockerfile` - Multi-stage build with proper native module handling

## Bug Reproduction Results

The following error occurs when the OpenAI package is bundled with Datadog tracing:

```
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at dc (/node_modules/openai/src/resources/chat/completions/completions.ts:1719:24)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/chat/chat.ts:5:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/chat/index.ts:3:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:3:1)
    at /app/main.js:1:209
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at Speech (/node_modules/openai/src/resources/audio/transcriptions.ts:12:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/audio/audio.ts:6:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:5:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at <anonymous> (/node_modules/openai/src/resources/audio/translations.ts:11:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/audio/audio.ts:22:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:5:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at <anonymous> (/node_modules/openai/src/resources/completions.ts:10:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:16:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/index.ts:6:10)
    at <anonymous> (/node_modules/openai/src/index.ts:25:21)
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at <anonymous> (/node_modules/openai/src/resources/embeddings.ts:8:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:34:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/index.ts:6:10)
    at <anonymous> (/node_modules/openai/src/index.ts:25:21)
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at <anonymous> (/node_modules/openai/src/resources/files.ts:14:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:55:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/index.ts:6:10)
    at <anonymous> (/node_modules/openai/src/index.ts:25:21)
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at Checkpoints (/node_modules/openai/src/resources/fine-tuning/jobs/jobs.ts:632:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/fine-tuning/fine-tuning.ts:18:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:65:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at <anonymous> (/node_modules/openai/src/resources/images.ts:9:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:67:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/index.ts:6:10)
    at <anonymous> (/node_modules/openai/src/index.ts:25:21)
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at <anonymous> (/node_modules/openai/src/resources/models.ts:9:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:76:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/index.ts:6:10)
    at <anonymous> (/node_modules/openai/src/index.ts:25:21)
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at <anonymous> (/node_modules/openai/src/resources/moderations.ts:7:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:77:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/client.ts:20:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/index.ts:6:10)
    at <anonymous> (/node_modules/openai/src/index.ts:25:21)
Error: esbuild-wrapped openai missing in list of hooks
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:33:9)
    at Channel.publish (node:diagnostics_channel:150:9)
    at <anonymous> (/node_modules/openai/src/index.ts:25:21)
    at /app/main.js:1:209
    at Object.<anonymous> (/src/index.ts:1:20)
    at Module._compile (node:internal/modules/cjs/loader:1730:14)
    at Object..js (node:internal/modules/cjs/loader:1895:10)
    at Module.load (node:internal/modules/cjs/loader:1465:32)
    at Function._load (node:internal/modules/cjs/loader:1282:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:31
    hooks[payload.package]()
                         ^


TypeError: bPt[t.package] is not a function
    at payload (/node_modules/dd-trace/packages/datadog-instrumentations/src/helpers/bundler-register.js:31:26)
    at Channel.publish (node:diagnostics_channel:150:9)
    at dc (/node_modules/openai/src/resources/chat/completions/completions.ts:1719:24)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/chat/chat.ts:5:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/chat/index.ts:3:1)
    at /app/main.js:1:209
    at <anonymous> (/node_modules/openai/src/resources/index.ts:3:1)
    at /app/main.js:1:209

Node.js v22.16.0
 ELIFECYCLE  Command failed with exit code 1.
```
