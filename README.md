# DSA Genie 🧞‍♂️

An **AI-powered personalized Data Structures & Algorithms practice platform** with gamification, contests, intelligent learning assistance, and automated end-to-end testing infrastructure. Deploy locally with Docker, or to the cloud with Kubernetes, Render, and Vercel.

The platform helps developers **learn DSA faster through adaptive recommendations, AI hints, analytics, and competitive coding experiences.**

---

## ✨ Features

### 🎯 Core Learning Features

* Personalized AI-based problem recommendations
* Interactive multi-language code editor
* Real-time AI assistant for hints & explanations
* Contest participation with leaderboards
* Structured learning paths
* Detailed performance analytics

### 🤖 AI Powered Intelligence

* Context-aware smart hints powered by OpenAI & Gemini
* Solution quality & time complexity feedback
* Personalized learning roadmaps
* AI-generated adaptive contests
* Chat-based DSA mentor
* Automatic AI problem generation with OpenAI

### 🏆 Gamification System

* Daily solving streak tracking
* XP & Level progression
* Coin reward economy
* Achievement badge system
* Global leaderboard rankings

### 🐳 DevOps & Infrastructure

* Docker & Docker Compose support
* Kubernetes deployment ready (K8s manifests included)
* CI/CD with Jenkins pipeline
* Infrastructure monitoring with Nagios
* Infrastructure-as-Code with Ansible playbooks
* Cloud deployment to Render & Vercel

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* OpenAI API & Gemini API
* bcryptjs

### Frontend

* React 18
* TypeScript
* Tailwind CSS
* Zustand
* React Router
* Heroicons
* Vite bundler

### Testing & Automation

* Selenium WebDriver
* Mocha test framework
* Jira test reporting integration
* Screenshot capture on failure
* Parallel & CI test execution

### DevOps & Infrastructure

* Docker & Docker Compose
* Kubernetes (K8s)
* Jenkins CI/CD
* Nagios Monitoring
* Ansible Automation
* Render & Vercel deployments

---

## 🚀 Getting Started

### ✅ Prerequisites

* **For local development**: Node.js (v16+), MongoDB
* **For Docker**: Docker & Docker Compose
* **For Kubernetes**: kubectl, Docker
* **For AI features**: OpenAI API Key or Gemini API Key

### Quick Start (3 options)

#### Option 1️⃣: Local Development

```bash
git clone <repository-url>
cd DSA

# Install dependencies
cd server && npm install
cd ../client && npm install

# Create .env file in server directory
# See Environment Setup section below

# Start server
cd server && npm run dev

# Start client (new terminal)
cd client && npm run dev
```

**Access**: Frontend → http://localhost:5173 | Backend → http://localhost:5000

#### Option 2️⃣: Docker (Recommended for quick setup)

```bash
git clone <repository-url>
cd DSA

# Copy server env to root
cp server/.env .env

# Start with Docker Compose
docker-compose up -d
```

**Access**: Frontend → http://localhost:3000 | Backend → http://localhost:5000

#### Option 3️⃣: Kubernetes (Production-ready)

```bash
# Build and push Docker images to your registry
docker build -t your-registry/dsa-client:latest ./client
docker build -t your-registry/dsa-server:latest ./server
docker push your-registry/dsa-client:latest
docker push your-registry/dsa-server:latest

# Update image references in k8s/*.yaml files
# Deploy to Kubernetes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/

# Access via ingress or port-forward
kubectl port-forward svc/server -n dsa-genie 5000:5000
kubectl port-forward svc/client -n dsa-genie 3000:3000
```

---

### ⚙️ Environment Setup

Create `.env` inside **server folder**:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dsa-genie
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dsa-genie

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# AI API Keys (choose one or both)
OPENAI_API_KEY=your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

**Optional setup scripts** (run from server directory):

```bash
# Setup MongoDB Atlas
node setup-atlas.js

# Setup OpenAI
node setup-openai.js

# Setup Gemini
node setup-gemini.js
```

---

## 📁 Project Structure

```
DSA/
│
├── 📂 client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/                     # Page components
│   │   ├── components/                # Reusable components
│   │   ├── stores/                    # Zustand store
│   │   └── utils/                     # API & helper utilities
│   ├── Dockerfile                     # Container image
│   ├── nginx.conf                     # Nginx configuration
│   ├── vite.config.js                 # Vite bundler config
│   └── package.json
│
├── 📂 server/                          # Node.js Express Backend
│   ├── routes/                        # API route handlers
│   ├── models/                        # MongoDB schemas
│   ├── middleware/                    # Auth & custom middleware
│   ├── utils/                         # AI integrations (OpenAI, Gemini)
│   ├── Dockerfile                     # Container image
│   ├── package.json
│   └── index.js                       # Entry point
│
├── 📂 tests/                           # End-to-end & Integration Tests
│   ├── e2e/                           # Selenium E2E tests
│   │   ├── tests/
│   │   │   ├── auth.test.js
│   │   │   ├── problems.test.js
│   │   │   └── smoke.test.js
│   │   ├── TestBase.js
│   │   └── JiraIntegration.js
│   ├── scripts/
│   │   └── upload-to-jira.js          # JIRA integration
│   ├── package.json
│   └── run-tests.js
│
├── 📂 k8s/                            # Kubernetes Manifests
│   ├── namespace.yaml                 # K8s namespace
│   ├── configmap.yaml                 # ConfigMap for configs
│   ├── secrets.yaml                   # Secrets
│   ├── deployment-client.yaml         # Client deployment
│   ├── deployment-server.yaml         # Server deployment
│   ├── service-client.yaml            # Client service
│   ├── service-server.yaml            # Server service
│   └── ingress.yaml                   # Ingress configuration
│
├── 📂 ansible/                        # Infrastructure as Code
│   ├── inventory.yml                  # Host inventory
│   ├── playbook.yml                   # Main playbook
│   └── templates/
│       └── env.j2                     # .env template
│
├── 📂 nagios/                         # Monitoring Configuration
│   ├── dsa-genie.cfg                  # Nagios host config
│   ├── dsa-genie-local.cfg            # Local monitoring config
│   └── README.md                      # Monitoring guide
│
├── 🐋 docker-compose.yml              # Docker Compose configuration
├── 📋 Jenkinsfile                     # CI/CD Pipeline
├── 📝 deploy-setup.js                 # Deployment setup script
├── 🌐 render.yaml                     # Render deployment config
├── 🌐 vercel.json                     # Vercel deployment config
│
├── 📖 DEPLOYMENT_GUIDE.md             # Cloud deployment (Render & Vercel)
├── 📖 DEVOPS_README.md                # DevOps tools guide
├── 📖 QUICK_SETUP.md                  # Quick start guide
├── 📖 AI_PROBLEM_GENERATION.md        # AI problem generation guide
├── 📖 GEMINI_SETUP.md                 # Gemini API setup
│
└── 📄 README.md                       # This file
```

---

## � AI Problem Generation

Generate DSA problems automatically using OpenAI:

### Command Line

```bash
cd server

# Generate default problems (arrays, strings, linked-lists)
node generateProblems.js

# Generate specific topic & difficulty
node generateProblems.js arrays easy
node generateProblems.js dynamic-programming hard
node generateProblems.js binary-search medium
```

### Admin Web Interface

1. Start frontend: `cd client && npm run dev`
2. Navigate to `/admin`
3. Select topic and difficulty
4. Click "Generate Problem with AI"

### API Endpoint

```bash
curl -X POST http://localhost:5000/api/ai/generate-problem \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "arrays",
    "difficulty": "medium"
  }'
```

---

## 🚢 Deployment Options

### Option 1: Docker Compose (Local/Production)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 2: Cloud Deployment - Render & Vercel

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Frontend deployment to Vercel
- Backend deployment to Render
- Environment variable configuration
- Database setup with MongoDB Atlas

### Option 3: Kubernetes (Production-Grade)

See [DEVOPS_README.md](DEVOPS_README.md) for:
- K8s cluster setup
- Namespace & resource creation
- Service & Ingress configuration
- Scaling & monitoring

### Option 4: Ansible (Infrastructure Automation)

```bash
cd ansible

# Configure your inventory
vim inventory.yml

# Run deployment playbook
ansible-playbook -i inventory.yml playbook.yml \
  -e "deploy_target=docker" \
  -e "mongo_uri=your-mongodb-uri" \
  -e "jwt_secret=your-jwt-secret"
```

---

## 🔧 DevOps & Infrastructure

### Docker

```bash
# Build images
docker build -t dsa-client:latest ./client
docker build -t dsa-server:latest ./server

# Run with Docker Compose
docker-compose up -d

# Build specific service
docker-compose build client
docker-compose build server
```

### Jenkins CI/CD Pipeline

1. Create a **Pipeline** job in Jenkins
2. Configure:
   - **Pipeline script from SCM**: Git repository URL
   - **Script path**: `Jenkinsfile`
3. Add credentials for:
   - Docker registry (optional)
   - Kubernetes (if deploying to K8s)

**Pipeline stages**:
- Checkout → Install dependencies → Run tests → Build Docker images → Push to registry → Deploy to Kubernetes

### Kubernetes Deployment

```bash
# Apply all K8s manifests
kubectl apply -f k8s/

# Check deployments
kubectl get deployments -n dsa-genie
kubectl get services -n dsa-genie
kubectl get pods -n dsa-genie

# View logs
kubectl logs -n dsa-genie deployment/server
kubectl logs -n dsa-genie deployment/client

# Port forward for local access
kubectl port-forward -n dsa-genie svc/server 5000:5000
kubectl port-forward -n dsa-genie svc/client 3000:3000
```

### Nagios Monitoring

Configuration files in `nagios/`:
- `dsa-genie.cfg`: Production monitoring config
- `dsa-genie-local.cfg`: Local development monitoring

Update host addresses based on your deployment:
- **Docker**: `localhost` or your server IP
- **Kubernetes**: Service names (`server.dsa-genie.svc`, `client.dsa-genie.svc`)

---

## 📦 Problem Seeder Scripts

### Import Problems from External Sources

```bash
cd server

# Import LeetCode problems
node importLeetCodeProblems.js

# Import CodeForces problems
node fetch_codeforces_problems.js

# Import generic problems
node importProblems.js

# Generate problems in batch
node generateProblemsBatch.js
```

### Add Test Cases

```bash
# Add test cases to existing problems
node add-test-cases.js

# Fix test case formatting
node fix-test-cases.js

# Add sample problems
node addSample.js
```

---

## 🧪 Test Automation Setup

### Install Test Dependencies

```bash
cd tests
npm install
```

### Configure Test Environment

```bash
cp .env.example .env
```

Update variables in `.env`:

```env
# Application URLs
BASE_URL=http://localhost:5173          # Frontend URL
API_URL=http://localhost:5000           # Backend API URL
HEADLESS=false                          # true for CI/CD

# JIRA Integration (optional)
JIRA_HOST=your-domain.atlassian.net
JIRA_USERNAME=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=DSA
```

### Run Automated Tests

```bash
cd tests

# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run with CI reporter
npm run test:ci

# Run tests in parallel
npm run test:parallel

# Run tests in headless mode
npm run test:headless
```

### Test Coverage

- **Smoke Tests**: Basic functionality verification
- **Auth Tests**: Registration, login, profile management
- **Problem Tests**: Problem fetching, submission, scoring
- **JIRA Integration**: Automatic test result reporting

---

## 📡 API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/me`
* PUT `/api/auth/profile`
* PUT `/api/auth/preferences`

### Problems

* GET `/api/problems`
* GET `/api/problems/:slug`
* POST `/api/problems/:id/submit`
* GET `/api/problems/stats`
* POST `/api/ai/generate-problem` (AI-generated)

### AI Features

* GET `/api/ai/recommendations`
* POST `/api/ai/hint`
* POST `/api/ai/explanation`
* POST `/api/ai/chat`
* GET `/api/ai/chat/history`
* POST `/api/ai/generate-problem`

### Contests

* GET `/api/contests`
* GET `/api/contests/:id`
* POST `/api/contests/:id/join`
* GET `/api/contests/:id/leaderboard`

### Leaderboard

* GET `/api/auth/leaderboard`

---

## 🛠️ Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB locally
mongod

# For MongoDB Atlas, ensure:
# 1. IP whitelist includes your IP
# 2. Credentials are correct in MONGODB_URI
# 3. Database exists
```

**Port Already in Use**
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000/5173 (frontend)
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**Docker Container Issues**
```bash
# View container logs
docker-compose logs -f server
docker-compose logs -f client

# Rebuild images
docker-compose build --no-cache

# Remove and restart
docker-compose down
docker-compose up -d
```

**Kubernetes Pod Issues**
```bash
# Check pod status
kubectl describe pod <pod-name> -n dsa-genie

# View pod logs
kubectl logs <pod-name> -n dsa-genie

# Delete and recreate
kubectl delete pod <pod-name> -n dsa-genie
```

**Test Failures**
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- tests/auth.test.js

# Debug with Selenium
HEADLESS=false npm test
```

---

## 📚 Documentation

* [QUICK_SETUP.md](QUICK_SETUP.md) - Quick start guide
* [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Cloud deployment (Render & Vercel)
* [DEVOPS_README.md](DEVOPS_README.md) - DevOps & infrastructure guide
* [AI_PROBLEM_GENERATION.md](AI_PROBLEM_GENERATION.md) - AI problem generation
* [GEMINI_SETUP.md](GEMINI_SETUP.md) - Gemini API setup
* [nagios/README.md](nagios/README.md) - Monitoring setup

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push branch: `git push origin feature/your-feature`
5. Open Pull Request

### Development Workflow

1. Create `.env` in server directory
2. Start backend: `cd server && npm run dev`
3. Start frontend: `cd client && npm run dev`
4. Run tests: `cd tests && npm test`
5. Create pull request with clear description

---

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

---

## 💬 Support & Community

* 📝 **Issues**: Open GitHub Issue for bugs or feature requests
* 💬 **Discussions**: Join our community discussions
* 📧 **Contact**: Reach out to maintainers

**We value contributions!** Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting PRs.

---

## 🎯 Roadmap

- [ ] Advanced problem recommendations using ML
- [ ] Real-time code collaboration
- [ ] Mobile app (React Native)
- [ ] Integration with coding platforms (LeetCode, CodeForces sync)
- [ ] AI-powered video tutorials
- [ ] Peer-to-peer mentorship system

---

⭐ **If you like this project, please star it on GitHub!**

**Built with ❤️ for the developer community**

**Happy DSA Learning 🚀**
