# DSA Genie 🧞‍♂️

An **AI-powered personalized Data Structures & Algorithms practice platform** with gamification, contests, intelligent learning assistance, and automated end-to-end testing infrastructure.

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

* Context-aware smart hints
* Solution quality & time complexity feedback
* Personalized learning roadmaps
* AI generated adaptive contests
* Chat-based DSA mentor

### 🏆 Gamification System

* Daily solving streak tracking
* XP & Level progression
* Coin reward economy
* Achievement badge system
* Global leaderboard rankings

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* OpenAI API
* bcryptjs

### Frontend

* React 18
* TypeScript
* Tailwind CSS
* Zustand
* React Router
* Heroicons

### Testing & Automation

* Selenium WebDriver
* Mocha test framework
* Jira test reporting integration
* Screenshot capture on failure
* Parallel & CI test execution

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js (v16+)
* MongoDB
* OpenAI API Key

---

### 📦 Installation

```bash
git clone <repository-url>
cd DSA
```

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

---

### ⚙️ Environment Setup

Create `.env` inside **server folder**

```env
MONGODB_URI=mongodb://localhost:27017/dsa-genie
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
CLIENT_URL=http://localhost:3000
PORT=5000
```

---

### ▶️ Run Application

```bash
# backend
cd server
npm run dev

# frontend
cd client
npm start
```

Frontend → http://localhost:3000
Backend → http://localhost:5000

---

## 📁 Project Structure

```
DSA/
│
├── client/
├── server/
│
├── tests/
│   ├── e2e/
│   │   ├── TestBase.js
│   │   ├── JiraIntegration.js
│   │   └── tests/
│   │       ├── smoke.test.js
│   │       ├── auth.test.js
│   │       └── problems.test.js
│   ├── scripts/
│   │   └── upload-to-jira.js
│   ├── .env.example
│   └── package.json
│
├── importProblems.js
├── run-tests.js
└── README.md
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

Update variables:

```env
BASE_URL=http://localhost:5173
API_URL=http://localhost:5000
HEADLESS=false

JIRA_HOST=your-domain.atlassian.net
JIRA_USERNAME=your-email
JIRA_API_TOKEN=your-token
JIRA_PROJECT_KEY=DSA
```

---

### ▶️ Run Automated Tests

Run all tests:

```bash
npm test
```

Run smoke tests only:

```bash
npm run test:smoke
```

Run CI reporter:

```bash
npm run test:ci
```

Run parallel execution:

```bash
npm run test:parallel
```

---

## 📦 Problem Seeder Script

Bulk import DSA problems:

```bash
node importProblems.js
```

This prepares:

* Recommendation engine dataset
* Contest problem pools
* Initial platform content

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

### AI Features

* GET `/api/ai/recommendations`
* POST `/api/ai/hint`
* POST `/api/ai/explanation`
* POST `/api/ai/chat`
* GET `/api/ai/chat/history`

### Contests

* GET `/api/contests`
* GET `/api/contests/:id`
* POST `/api/contests/:id/join`
* GET `/api/contests/:id/leaderboard`

### Leaderboard

* GET `/api/auth/leaderboard`

---

## 🤝 Contributing

1. Fork repository
2. Create branch
3. Commit changes
4. Push branch
5. Open Pull Request

---

## 📄 License

MIT License

---

## 💬 Support

For issues:

* Open GitHub Issue
* Contact maintainers

---

⭐ If you like this project consider giving it a **star**

**Happy Coding 🚀**
