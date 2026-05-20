import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "https://dummy@o0.ingest.sentry.io/0",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // 10% sampling in production to control Sentry quota; 100% in development
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  replaysSessionSampleRate: import.meta.env.PROD ? 0.05 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.PROD ? "production" : "development",
});


import App from "./App";
import "./styles.css";
import "./utils/vitals"; // Core Web Vitals → Sentry (side-effect import)


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

