/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      // Serve the pre-built Vite frontend — run `npm run build` before LHCI
      staticDistDir: "./dist",
      numberOfRuns: 3,   // Average over 3 runs for stable scores
      settings: {
        // Simulate a typical mobile connection (Fast 3G)
        // Matches Lighthouse's "mobile" preset for realistic CWV scores
        throttlingMethod: "simulate",
        formFactor: "desktop",    // Desktop for SPA; change to 'mobile' for PWA audit
        screenEmulation: { disabled: true },
      },
    },

    assert: {
      preset: "lighthouse:no-pwa", // No PWA checks required
      assertions: {
        // ── Minimum score thresholds ──────────────────────────────────────
        "categories:performance":    ["error", { minScore: 0.9 }],
        "categories:accessibility":  ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo":            ["warn",  { minScore: 0.8 }],

        // ── Core Web Vitals (numeric budgets) ─────────────────────────────
        // LCP  — Largest Contentful Paint
        "largest-contentful-paint":  ["error", { maxNumericValue: 2500 }],
        // FCP  — First Contentful Paint
        "first-contentful-paint":    ["error", { maxNumericValue: 1800 }],
        // TBT  — Total Blocking Time (proxy for FID/INP in lab)
        "total-blocking-time":       ["error", { maxNumericValue: 200 }],
        // CLS  — Cumulative Layout Shift
        "cumulative-layout-shift":   ["error", { maxNumericValue: 0.1 }],
        // SI   — Speed Index
        "speed-index":               ["warn",  { maxNumericValue: 3400 }],

        // ── Best practice checks ──────────────────────────────────────────
        "uses-https":                     ["off"],  // not relevant in preview
        "uses-http2":                     ["warn"],
        "render-blocking-resources":      ["warn"],
        "unused-javascript":              ["warn"],
        "uses-optimized-images":          ["warn"],
      },
    },

    upload: {
      // Free temporary public storage — no server setup needed.
      // Results are available for 7 days via a shareable URL.
      target: "temporary-public-storage",
    },
  },
};
