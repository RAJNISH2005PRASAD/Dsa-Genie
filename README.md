# DSA Genie 🧞‍♂️

An AI-powered personalized DSA (Data Structures and Algorithms) practice platform with gamification, contests, and intelligent learning features.

## Features ✨

### 🎯 Core Features
- **Personalized Problem Recommendations** - AI-powered suggestions based on your skill level
- **Interactive Problem Solving** - Code editor with multiple language support
- **Real-time AI Assistant** - Get hints, explanations, and learning guidance
- **Gamification System** - Coins, streaks, levels, and achievements
- **Contest System** - Participate in timed competitions with leaderboards
- **Progress Tracking** - Detailed analytics and learning path visualization

### 🤖 AI-Powered Features
- **Smart Hints** - Contextual hints that don't spoil the solution
- **Solution Analysis** - Get feedback on your code quality and efficiency
- **Learning Paths** - Personalized roadmaps for skill development
- **Problem Explanations** - Detailed breakdowns of optimal approaches
- **Adaptive Contests** - AI-generated contests based on your level

### 🏆 Gamification
- **Daily Streaks** - Maintain consistency with daily practice
- **Coin System** - Earn coins by solving problems and use them for hints
- **Level Progression** - Level up as you gain experience
- **Achievements** - Unlock badges for milestones and special accomplishments
- **Leaderboards** - Compete with other learners

## Tech Stack 🛠️

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **OpenAI API** - AI-powered features
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Heroicons** - Icons

## Getting Started 🚀

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DSA
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/dsa-genie
   JWT_SECRET=your-secret-key
   OPENAI_API_KEY=your-openai-api-key
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend server (from client directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure 📁

```
DSA/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand state management
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── index.js         # Server entry point
└── README.md
```

## API Endpoints 📡

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/preferences` - Update preferences

### Problems
- `GET /api/problems` - Get problems list
- `GET /api/problems/:slug` - Get problem details
- `POST /api/problems/:id/submit` - Submit solution
- `GET /api/problems/stats` - Get problem statistics

### AI Features
- `GET /api/ai/recommendations` - Get personalized recommendations
- `POST /api/ai/hint` - Get AI-generated hint
- `POST /api/ai/explanation` - Get problem explanation
- `POST /api/ai/chat` - AI assistant chat
- `GET /api/ai/chat/history` - Get chat history

### Contests
- `GET /api/contests` - Get contests list
- `GET /api/contests/:id` - Get contest details
- `POST /api/contests/:id/join` - Join contest
- `GET /api/contests/:id/leaderboard` - Get contest leaderboard

### Leaderboard
- `GET /api/auth/leaderboard` - Get global leaderboard

## Features in Detail 🔍

### AI-Powered Learning
The platform uses OpenAI's GPT models to provide:
- **Contextual Hints**: AI analyzes your current code and provides targeted hints
- **Solution Analysis**: Get feedback on code quality, efficiency, and best practices
- **Personalized Recommendations**: AI suggests problems based on your skill level and learning history
- **Learning Paths**: Custom roadmaps for mastering specific topics

### Gamification System
- **Experience Points**: Earn XP for solving problems (50 for easy, 100 for medium, 200 for hard)
- **Level System**: Level up every 100 XP × current level
- **Daily Streaks**: Maintain consistency with daily practice tracking
- **Coin Economy**: Earn coins for solving problems, spend them on hints
- **Achievements**: Unlock badges for milestones and special accomplishments

### Contest System
- **Timed Competitions**: Participate in contests with specific time limits
- **Problem Sets**: Curated problem collections for contests
- **Leaderboards**: Real-time rankings during contests
- **Prize Pools**: Win coins and achievements
- **Adaptive Contests**: AI-generated contests based on participant levels

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🚀** 

node importProblems.js "# dsa-genie" 
