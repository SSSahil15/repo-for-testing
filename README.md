# DevPulse

DevPulse is an AI-powered DevSecOps platform that helps teams authenticate with GitHub, select repositories, run intelligent CI/CD analysis, and surface actionable risk insights.

## Current Progress

This bootstrap includes:

- A production-minded project structure
- A Node.js + Express backend secured by Supabase JWT validation
- Encrypted server-side storage for GitHub provider tokens
- Repository listing via the GitHub API
- A React frontend with Supabase GitHub login, callback handling, dashboard, repository selection, and analysis views
- A starter `/analyze` endpoint contract for the upcoming CI, Trivy, and ML steps

## Project Structure

```text
devpulse/
├── .github/workflows/      # GitHub Actions workflows
├── ai/                     # Python ML model and explanation engine
├── backend/                # Express API and GitHub OAuth server
├── docker/                 # Docker assets added in later steps
└── frontend/               # React dashboard added in the next step
```

## Quick Start

1. Create a Supabase project
2. In Supabase Authentication -> Providers, enable GitHub
3. Register the GitHub OAuth app using the Supabase callback URL:
   `https://<project-ref>.supabase.co/auth/v1/callback`
4. Add `http://localhost:5173/auth/callback` to the Supabase redirect allow list
5. Copy `backend/.env.example` to `backend/.env`
6. Copy `frontend/.env.example` to `frontend/.env`
7. Fill in the Supabase project URL and publishable key in both files
8. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

9. Start the API server:

   ```bash
   npm run dev
   ```

The backend will start on `http://localhost:4000`.

## Frontend Quick Start

1. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend:

   ```bash
   npm run dev
   ```

The React app will start on `http://localhost:5173`.

## Available API Endpoints

- `GET /health`
- `GET /auth/me`
- `POST /auth/provider-token`
- `DELETE /auth/provider-token`
- `GET /repos`
- `POST /analyze`
