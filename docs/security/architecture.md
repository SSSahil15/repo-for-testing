# Security Architecture

DevPulse incorporates a robust security posture to guarantee absolute protection of developer OAuth tokens and scanned repository assets.

---

## 1. Secrets Cryptography

To protect sensitive GitHub API access tokens, DevPulse implements robust, symmetric encryption at the service layer (`providerTokenStore.service.js`):

- **Algorithm**: `AES-256-CBC`
- **Key Generation**: Driven strictly by the `TOKEN_ENCRYPTION_SECRET` environment variable (must be at least 32 characters long).
- **Execution Flow**:
  - Before saving to PostgreSQL, raw tokens are encrypted and combined with a unique, cryptographically random **Initialization Vector (IV)**.
  - When query operations request a token, the service decrypts the column using the stored IV, ensuring raw tokens are never saved or exposed in plain text in database tables.

---

## 2. API Hardening

We restrict malicious traffic and exploit paths using the following defensive shields:

- **Express Rate Limiting**: Implemented globally on all API routers and strictly configured on authentication routes to mitigate brute-force and DDoS attacks.
- **Helmet Middleware**: Injects essential HTTP headers (e.g. X-Content-Type-Options, Content-Security-Policy) to mitigate cross-site scripting (XSS) and clickjacking.
- **Strict CORS Polices**: Cross-Origin Resource Sharing is strictly constrained to authorized domains (e.g. your production frontend Vercel deployment URL). All cross-origin preflight requests from unauthorized origins are immediately rejected.
- **Parameter Validation**: Input payloads are strongly parsed and validated at the router interface using **Zod** models, preventing malformed parameters or SQL-injection attempts.

---

> [!WARNING]
> In production environments, never log raw headers, authorization tokens, or decrypted database columns. Check out [Secrets Management Guide](file:///Users/sssa15/DevPulse/docs/SECRETS.md) for environment parameters guidelines.
