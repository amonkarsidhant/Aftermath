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

   Key variables:

   - `PORT` – backend server port (default: 5000)
   - `BACKEND_URL` – base URL for the backend (default: http://localhost:5000 in development)
   - `FRONTEND_URL` – base URL for the frontend (default: http://localhost:3000 in development)
   - `JWT_SECRET` – secret for signing JSON Web Tokens

   In development, the backend listens on port 5000 and the frontend on port 3000. Update these URLs if your production deployment uses different ports.

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

## Roles

JWT tokens include a `role` claim used for role-based access control.
The sample backend defines `admin` and `user` roles. Endpoints like
`/actions` and `/metrics` are limited to users with the `admin` role.

## Documentation

- [Integration connectors](docs/integrations.md)
- [Deployment guide](docs/deployment.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on coding standards, pull requests, and testing.
