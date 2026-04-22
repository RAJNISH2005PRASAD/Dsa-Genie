# DSA Genie - DevOps Guide

This project includes **Docker**, **Jenkins**, **Nagios**, **Ansible**, and **Kubernetes** configurations.

## Quick Start

### 1. Docker (Local Development/Production)

```bash
# Create .env file in project root (copy from server/.env)
cp server/.env .env
# Edit .env - ensure MONGO_URI, JWT_SECRET, CLIENT_URL are set

# Build and run
docker-compose up -d

# With local MongoDB (no Atlas)
docker-compose --profile local up -d
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 2. Jenkins (CI/CD)

1. Create a **Pipeline** job in Jenkins
2. Set **Pipeline script from SCM** → Git repo URL
3. Script Path: `Jenkinsfile`
4. Add credentials (optional):
   - `docker-registry-credentials` for Docker registry
   - Ensure `kubectl` is configured on Jenkins agent for K8s deploy

**Pipeline stages**: Checkout → Install → Test → Build → Docker Build → Docker Push → Deploy to K8s

### 3. Nagios (Monitoring)

```bash
# Add to Nagios config
cfg_file=/path/to/nagios/dsa-genie.cfg
```

**Update host addresses** in `nagios/dsa-genie.cfg`:
- Docker: Use `localhost` or your server IP
- Kubernetes: Use service names (`server.dsa-genie.svc`, `client.dsa-genie.svc`)

### 4. Ansible (Deployment Automation)

```bash
cd ansible

# Edit inventory.yml - set your server IP and variables
# Edit group_vars or pass -e "mongo_uri=... jwt_secret=..."

ansible-playbook -i inventory.yml playbook.yml -e "deploy_target=docker"
```

### 5. Kubernetes

```bash
# 1. Build and push images (or use Jenkins)
docker build -t localhost:5000/dsa-genie-server:latest ./server
docker build -t localhost:5000/dsa-genie-client:latest ./client

# 2. Create secrets (replace with your values)
kubectl create secret generic dsa-genie-secrets \
  --from-literal=MONGO_URI='your-mongo-uri' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --from-literal=CLIENT_URL='http://your-domain' \
  -n dsa-genie

# 3. Deploy
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/ -n dsa-genie
```

## File Structure

```
DSA/
├── docker-compose.yml      # Docker Compose
├── Jenkinsfile             # Jenkins pipeline
├── server/
│   └── Dockerfile
├── client/
│   ├── Dockerfile
│   └── nginx.conf
├── nagios/
│   ├── dsa-genie.cfg       # Nagios config
│   └── README.md
├── ansible/
│   ├── inventory.yml
│   ├── playbook.yml
│   └── templates/env.j2
└── k8s/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── secrets.yaml
    ├── deployment-server.yaml
    ├── deployment-client.yaml
    ├── service-server.yaml
    ├── service-client.yaml
    └── ingress.yaml
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |
| CLIENT_URL | Frontend URL for CORS |
| VITE_API_URL | API URL for frontend build |

## Troubleshooting

- **Docker build fails**: Ensure `node_modules` is not copied (`.dockerignore`)
- **K8s pod CrashLoopBackOff**: Check secrets and `kubectl logs`
- **Nagios check fails**: Verify host/port and `check_http` plugin
- **Jenkins pipeline fails**: Ensure Docker and kubectl are on the agent
