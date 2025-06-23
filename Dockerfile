# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install

COPY src/ ./src/
COPY build.js ./
RUN npm run build

# Runtime stage
FROM node:22-alpine AS base

WORKDIR /app

RUN npm install --no-package-lock --no-save @datadog/pprof @datadog/native-metrics

COPY --from=builder /app/dist/ .

ENV DD_VERSION=123456
ENV DD_PROFILING_ENABLED=true
ENV DD_GIT_REPOSITORY_URL=https://github.com/mra-energy/dd-trace-bug-repro
ENV DD_GIT_COMMIT_SHA=

ENV DD_AGENT_HOST=ecair-datadog.internal
ENV DD_TRACE_DEBUG=true

# https://github.com/DataDog/dd-trace-js/issues/4574
# https://github.com/DataDog/dd-trace-js/pull/5793
# https://github.com/DataDog/dd-trace-js/issues/4424
# https://docs.datadoghq.com/tracing/trace_collection/compatibility/nodejs/
# ENV DD_TRACE_DISABLED_PLUGINS=openai,dns
# ENV DD_TRACE_DISABLED_INSTRUMENTATIONS=openai,dns
# ENV DD_TRACE_OPENAI_ENABLED=false

RUN addgroup -g 1001 -S nodejs
RUN adduser -S zinedine_zidane -u 1001

USER zinedine_zidane
EXPOSE 3000
CMD ["node", "--enable-source-maps", "-r", "./init-instrumentation.js", "./main.js"]