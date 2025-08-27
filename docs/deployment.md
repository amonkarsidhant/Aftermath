# Deployment

This guide covers running Aftermath using Docker or Kubernetes.

The backend requires a `JWT_SECRET` environment variable for signing JSON Web Tokens. The server exits during startup if it is missing.

## Docker Compose

Use the provided `docker-compose.yml` to start the application locally:

```bash
docker compose up --build
```

The command builds images for the backend, frontend, and integrations services and starts them with sensible defaults. Ensure the `JWT_SECRET` variable is supplied to the backend service, for example:

```yaml
services:
  backend:
    environment:
      - PORT=5000
      - JWT_SECRET=replace-with-secure-value
```

## Kubernetes

A minimal deployment can be achieved by containerizing the services and applying Kubernetes manifests. Create a `Secret` containing the JWT value and reference it from the backend deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aftermath-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aftermath-backend
  template:
    metadata:
      labels:
        app: aftermath-backend
    spec:
      containers:
        - name: backend
          image: your-registry/aftermath-backend:latest
          env:
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: aftermath-jwt
                  key: jwt
          ports:
            - containerPort: 3000
```

Expose the service using a `Service` or `Ingress` resource as appropriate for your cluster.

## Helm

Helm charts for the backend and frontend are available under `deploy/helm`.

Create a `Secret` for the backend JWT value:

```bash
kubectl create secret generic aftermath-jwt --from-literal=jwt=replace-with-secure-value
```

Install the backend, referencing the secret name:

```bash
helm install backend deploy/helm/backend --set secret.name=aftermath-jwt
```

Install the frontend and set the API URL for the backend service:

```bash
helm install frontend deploy/helm/frontend --set env.apiUrl=http://backend:5000
```

Use `--set` or a custom values file to override image tags, environment variables, and service ports.

Both charts ship with a ServiceAccount, Role, and RoleBinding to grant minimal access to the Kubernetes API. Override `rbac.create=false` if you wish to supply your own RBAC resources.
