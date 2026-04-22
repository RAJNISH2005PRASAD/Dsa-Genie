# Nagios Monitoring - DSA Genie

## Setup

### 1. Install Nagios Plugins
Ensure `check_http` is available (part of nagios-plugins package):
```bash
# Ubuntu/Debian
apt-get install nagios-plugins

# RHEL/CentOS
yum install nagios-plugins
```

### 2. Add Configuration
Copy or symlink this config to your Nagios config directory:
```bash
# Add to nagios.cfg
cfg_file=/etc/nagios/objects/dsa-genie.cfg
```

### 3. Docker/Kubernetes Integration
- **Docker Compose**: Replace `dsa-genie-server` and `dsa-genie-client` with actual hostnames (e.g., `localhost` or your server IP)
- **Kubernetes**: Use the ClusterIP service names: `server.dsa-genie.svc.cluster.local` and `client.dsa-genie.svc.cluster.local`

### 4. Update Host Addresses
Edit `dsa-genie.cfg` and set the correct `address` and check_command hosts:
- For local Docker: use `localhost` or `127.0.0.1`
- For remote: use your server IP or hostname

## Monitored Services
| Service | Check | Port |
|---------|-------|------|
| API Health | HTTP GET /api/health | 5000 |
| Frontend | HTTP GET / | 80 |
| API Response Time | HTTP with warn/critical thresholds | 5000 |
