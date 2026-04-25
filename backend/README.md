# DevPulse Backend

This service handles Supabase-authenticated API requests, secure GitHub provider-token storage, repository listing, and the first version of repository analysis responses.

## Setup

1. Copy `.env.example` to `.env`
2. Fill in your Supabase project URL and publishable key
3. Install dependencies with `npm install`
4. Run tests with `npm test`
5. Start the server with `npm run dev`

## Supabase Auth Setup

1. Create a Supabase project
2. In the Supabase dashboard, enable the GitHub auth provider
3. Supabase will show you the GitHub callback URL you must register with GitHub:
   `https://<project-ref>.supabase.co/auth/v1/callback`
4. In Supabase Authentication settings, add this redirect URL for the frontend:
   `http://localhost:5173/auth/callback`
5. Copy your Supabase project URL and publishable key into `.env`

The backend verifies Supabase access tokens using `supabase.auth.getUser(jwt)` and stores the user's GitHub provider token in an encrypted local file for API access.

## Endpoints

- `GET /health`: Service health check
- `GET /auth/me`: Returns the current authenticated Supabase user and token-sync state
- `POST /auth/provider-token`: Stores the GitHub provider token for the current Supabase user
- `DELETE /auth/provider-token`: Removes the stored GitHub provider token for the current Supabase user
- `GET /repos`: Returns repositories visible to the logged-in user
- `POST /analyze`: Returns a starter analysis contract for a selected repository

## Example Analyze Request

```bash
curl -X POST http://localhost:4000/analyze \
  -H "Authorization: Bearer <supabase-access-token>" \
  -H "Content-Type: application/json" \
  -d '{"repositoryFullName":"octocat/Hello-World"}'
```
