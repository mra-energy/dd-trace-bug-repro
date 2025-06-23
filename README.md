
# Datadog Trace Bug Reproduction

This repository demonstrates and reproduces specific issues with the Datadog tracing library (`dd-trace-js`) in Node.js applications. The project is configured to help isolate and test various tracing-related problems, particularly those involving OpenAI instrumentation conflicts and module resolution issues.

## Background

The Datadog Node.js tracing library has encountered several known issues related to OpenAI integration and module bundling:

- **OpenAI Plugin Errors** ([#4574](https://github.com/DataDog/dd-trace-js/issues/4574)): Runtime errors when the OpenAI plugin attempts to trace API calls, causing "Cannot read properties of undefined" exceptions
- **Module Resolution Issues** ([#4424](https://github.com/DataDog/dd-trace-js/issues/4424)): Webpack and bundler failures due to missing `tiktoken` module dependencies, even in projects not using OpenAI
- **Instrumentation Conflicts** ([#5793](https://github.com/DataDog/dd-trace-js/pull/5793)): Version compatibility issues between OpenAI package versions and the Datadog tracing instrumentation

Despite Datadog's [official compatibility documentation](https://docs.datadoghq.com/tracing/trace_collection/compatibility/nodejs/) indicating support for OpenAI v5, real-world bundling scenarios reveal compatibility issues that this reproduction environment helps test and isolate.

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
- `DD_TRACE_DISABLED_PLUGINS=openai,dns` - Disables problematic plugins
- `DD_TRACE_DISABLED_INSTRUMENTATIONS=openai,dns` - Disables instrumentations
- `DD_TRACE_OPENAI_ENABLED=false` - Explicitly disables OpenAI tracing
- `DD_TRACE_DEBUG=true` - Enables debug logging

## Files

- `src/index.ts` - Express server with conditional OpenAI usage
- `src/init-instrumentation.ts` - Datadog tracer initialization
- `build.js` - esbuild configuration with external module handling
- `Dockerfile` - Multi-stage build with proper native module handling

## Bug Reproduction Results

The following error occurs when the OpenAI package is bundled with Datadog tracing:

```
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
```