import client from "prom-client";

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequestsTotal = new client.Counter({ name: "http_requests_total", help: "Total number of HTTP requests", labelNames: ["method", "route", "status_code"] });

register.registerMetric(httpRequestsTotal);

export const httpRequestDurationSeconds = new client.Histogram({ name: "http_request_duration_seconds", help: "Duration of HTTP requests in seconds", labelNames: ["method", "route", "status_code"], buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10] });

register.registerMetric(httpRequestDurationSeconds);
