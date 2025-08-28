# Roles

After authentication, JSON Web Tokens include a `role` claim used by the frontend to decide which dashboard to render.

## admin (SRE)
- Access to the SRE dashboard
- Views operational metrics, MTTR charts, and timeline information

## user (Executive)
- Access to the executive dashboard
- Sees high-level KPIs, SLA summaries, and status charts
