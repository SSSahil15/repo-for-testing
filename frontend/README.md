# DevPulse Frontend

This React app provides the DevPulse login experience and dashboard using Supabase Auth.

## Features

- Login page powered by `supabase.auth.signInWithOAuth({ provider: "github" })`
- PKCE callback page that exchanges the auth code for a Supabase session
- Protected dashboard that sends Supabase bearer tokens to the backend
- Repository search and selection
- Analyze button wired to `POST /analyze`
- Results view for risk score, failure prediction, vulnerability summary, and AI suggestions

## Setup

1. Copy `.env.example` to `.env`
2. Add your Supabase project URL and publishable key
3. Install dependencies with `npm install`
4. Start the app with `npm run dev`

The development server runs at `http://localhost:5173`.
