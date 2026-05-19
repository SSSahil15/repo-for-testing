# REST Endpoints API Reference

This document catalogs all core RESTful API endpoints exposed by the DevPulse API server.

---

## 1. Authentication Endpoints

### `GET /auth/github`
- **Description**: Initiates the GitHub OAuth redirect flow.
- **Authentication**: None.

### `GET /auth/github/callback`
- **Description**: Receives authorization codes from GitHub and redirects to `/auth/callback?token=...`.
- **Authentication**: None.

### `GET /auth/me`
- **Description**: Returns details of the currently authenticated session.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "username": "sahil_developer",
    "avatarUrl": "https://avatars.githubusercontent.com/u/123",
    "email": "sahil@devpulse.com"
  }
  ```

---

## 2. Pipeline & Simulation Endpoints

### `POST /api/pipeline/simulate`
- **Description**: Triggers a simulated CI/CD scan job with custom telemetry presets.
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**:
  ```json
  {
    "repository": "SSSahil15/devpulse",
    "preset": "vulnerable_dependency"
  }
  ```
- **Response `202 Accepted`**:
  ```json
  {
    "message": "Simulation job dispatched.",
    "jobId": "job_9a2f1c8e..."
  }
  ```

### `GET /api/pipeline/status/:jobId`
- **Description**: Fetches execution telemetry and live logs of the specified background job.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response `200 OK`**:
  ```json
  {
    "jobId": "job_9a2f1c8e...",
    "status": "processing",
    "logs": [
      "Cloning repository...",
      "Analyzing dependency tree..."
    ]
  }
  ```

---

## 3. Public Sharing Endpoints

### `POST /api/reports`
- **Description**: Exports a static, read-only report snapshot and issues a shareable token.
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**:
  ```json
  {
    "pipelineId": "12345"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "token": "dp_rpt_5f8a2e1d7c3b9a0f...",
    "url": "http://localhost:5173/reports/dp_rpt_5f8a2e1d7c3b9a0f..."
  }
  ```

### `GET /api/reports/:token`
- **Description**: Fetches a public, static report snapshot.
- **Authentication**: None (Public Access).
- **Response `200 OK`**:
  ```json
  {
    "token": "dp_rpt_5f8a2e...",
    "repository": "SSSahil15/devpulse",
    "score": 92,
    "stages": {
      "security": { "critical": 0, "high": 2 }
    },
    "expired": false
  }
  ```
