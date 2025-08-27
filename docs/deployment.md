# Deployment

This guide covers running Aftermath using Docker or Kubernetes.

## Docker Compose

Use the provided `docker-compose.yml` to start the application locally:

```bash
docker compose up --build
```

The command builds images for the backend, frontend, and integrations services and starts them with sensible defaults.

## Kubernetes

A minimal deployment can be achieved by containerizing the services and applying Kubernetes manifests. Below is an example for the backend:

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
          ports:
            - containerPort: 3000
```

Expose the service using a `Service` or `Ingress` resource as appropriate for your cluster.
