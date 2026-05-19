# Quick Start Guide

Welcome to DevPulse! This 5-minute quick start guide will walk you through your very first GitHub repository analysis and AI-assisted triage scan.

---

## Step 1: Fire Up the Platform

Ensure all docker containers are initialized and running:
```bash
docker-compose up -d
```
Then start the frontend development bundle:
```bash
cd frontend && npm install && npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

---

## Step 2: Sign In with GitHub

1. On the DevPulse landing page, click the **Login with GitHub** button.
2. Authorize the DevPulse OAuth application.
3. You will be immediately redirected back to the secure dashboard (`/dashboard`).

---

## Step 3: Connect Your First Repository

1. Once on the dashboard, you will see a list of repositories you own or collaborate on.
2. Select any repository from the sidebar or main table.
3. Click the **Trigger Analysis** button in the header.

---

## Step 4: Run a CI/CD Simulation

1. Once the repo detail loads, click **Trigger Simulation**.
2. Select a simulation preset (e.g. `Vulnerable Dependency`, `Standard PR Commit`).
3. Click **Simulate**. The pipeline terminal will output live telemetry as it executes:
   - Clones Repository
   - Audits Package Dependencies
   - Runs Static Code Security Analysis via Trivy
   - Estimates the DevPulse Health Score

---

## Step 5: Read Insights & Remediation Diffs

- **Vulnerabilities**: Look at the security vulnerabilities list.
- **AI Remediation**: Click **AI Copilot** next to any vulnerability or in the chat drawer.
- Ask the AI Copilot: *"Explain how to remediate the vulnerability in package X"*
- Look at the generated secure code block and remediation advice!

---

> [!NOTE]
> For a deep-dive walkthrough of what happens behind the scenes during scans and scores, check out [First Analysis Guide](file:///Users/sssa15/DevPulse/docs/getting-started/first-analysis.md).
