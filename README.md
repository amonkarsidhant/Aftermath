# Aftermath

This repository contains the core code for the Aftermath project.

## Structure

- `frontend/` – React (Next.js/Vite) frontend
- `backend/` – Node.js/Express or FastAPI backend
- `integrations/` – Connectors for ServiceNow, PagerDuty, JIRA, etc.
- `plugins/` – Community-driven integrations
- `docs/` – Documentation and API references

Additional files:

- `.env.example` – Example environment variables for APIs
- `docker-compose.yml` – Docker Compose configuration

## Installation

1. **Install dependencies**

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../integrations && npm install
   ```

2. **Environment variables**

   Copy the example file and update values as needed:

   ```bash
   cp .env.example .env
   ```

## Running locally

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## Configuring integrations

Set the connector credentials and API URLs in your `.env` file:

- `JIRA_ENDPOINT` and `JIRA_TOKEN`
- `PAGERDUTY_ENDPOINT` and `PAGERDUTY_TOKEN`
- `SERVICENOW_ENDPOINT` and `SERVICENOW_TOKEN`

The `JWT_SECRET` key is also required for authentication.
