# Roles

After authentication, JSON Web Tokens include a `role` claim used by the frontend to decide which dashboard to render.

## admin
- Full access to all dashboards and administrative APIs.

## sre
- Access to the SRE dashboard
- Views operational metrics, MTTR charts, and timeline information

## manager
- Access to management dashboards
- Views team performance metrics and reports

## executive
- Access to the executive dashboard
- Sees high-level KPIs, SLA summaries, and status charts
