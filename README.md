# NEXUS — AI-Powered IELTS & English Test Platform

> Production-grade full-stack test preparation platform with 3D UI, AI question generation, and real-time analytics.

---

## 🚀 Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18, Tailwind CSS, Framer Motion, Three.js  |
| Backend    | Node.js, Express.js                              |
| Database   | MongoDB (Mongoose ODM)                           |
| Auth       | JWT (JSON Web Tokens)                            |
| AI         | OpenAI GPT-4o-mini                               |
| Charts     | Recharts                                         |
| 3D         | @react-three/fiber, @react-three/drei            |

---

## 📁 Project Structure

```
nexus-test/
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.js          # Responsive nav + 3D/Lite toggle
│   │   │   │   ├── PageLayout.js      # Page wrapper with background
│   │   │   │   ├── PrivateRoute.js    # Auth guard
│   │   │   │   └── AdminRoute.js      # Admin guard
│   │   │   └── threejs/
│   │   │       ├── ThreeBackground.js # 3D animated background
│   │   │       └── LiteBackground.js  # CSS fallback background
│   │   ├── context/
│   │   │   ├── AuthContext.js         # Auth state + axios
│   │   │   └── ThemeContext.js        # 3D/Lite mode + FPS monitor
│   │   ├── pages/
│   │   │   ├── HomePage.js            # Landing page
│   │   │   ├── LoginPage.js           # Sign in
│   │   │   ├── RegisterPage.js        # Sign up
│   │   │   ├── DashboardPage.js       # User dashboard + charts
│   │   │   ├── TestPage.js            # Test taking experience
│   │   │   ├── ResultsPage.js         # Results + analysis
│   │   │   ├── LeaderboardPage.js     # Global rankings
│   │   │   ├── AdminPage.js           # Admin panel
│   │   │   └── ProfilePage.js         # User profile + settings
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css                  # Global styles + Tailwind
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                   # Express backend
│   ├── controllers/
│   │   ├── authController.js          # Register, login, profile
│   │   ├── questionController.js      # Question CRUD
│   │   └── testController.js          # Test submission + scoring
│   ├── models/
│   │   ├── User.js                    # User model + methods
│   │   ├── Question.js                # Question model
│   │   └── TestResult.js              # Test results model
│   ├── middleware/
│   │   └── auth.js                    # JWT + role middleware
│   ├── routes/
│   │   ├── auth.js                    # /api/auth
│   │   ├── questions.js               # /api/questions
│   │   ├── tests.js                   # /api/tests
│   │   ├── users.js                   # /api/users
│   │   ├── admin.js                   # /api/admin
│   │   ├── leaderboard.js             # /api/leaderboard
│   │   └── ai.js                      # /api/ai
│   ├── .env.example
│   ├── package.json
│   └── index.js                       # Server entry point
│
└── database/
    └── seeder.js                      # DB seeder (180+ questions)
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone the project
```bash
git clone <your-repo>
cd nexus-test
```

---

### 2. Setup the Server

```bash
cd server

# Install dependencies
npm install

# Create .env from example
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development

# Your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/nexus_test_db

# Strong random string (change in production!)
JWT_SECRET=your_super_secret_jwt_key_here_2024

# OpenAI API key (for AI generator)
OPENAI_API_KEY=sk-your-openai-key-here

# Admin account (created by seeder)
ADMIN_EMAIL=admin@nexustest.com
ADMIN_PASSWORD=Admin@123456

CLIENT_URL=http://localhost:3000
```

---

### 3. Seed the Database

```bash
# Inside server/ folder
node ../database/seeder.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing questions
✅ Inserted 30 questions
✅ Admin user created
   Email: admin@nexustest.com
   Password: Admin@123456
🎉 Database seeded successfully!
```

---

### 4. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

### 5. Setup the Client

```bash
cd ../client

# Install dependencies
npm install

# Start the development server
npm start
```

Client runs at: **http://localhost:3000**

---

## 🔑 Default Credentials

| Role  | Email                   | Password     |
|-------|-------------------------|--------------|
| Admin | admin@nexustest.com     | Admin@123456 |
| User  | Register at /register   | Your choice  |

---

## 📊 API Endpoints

### Auth
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | /api/auth/register    | Create account         |
| POST   | /api/auth/login       | Sign in                |
| GET    | /api/auth/me          | Get current user       |
| PUT    | /api/auth/profile     | Update name            |
| PUT    | /api/auth/change-password | Change password   |

### Questions
| Method | Endpoint                      | Auth   | Description               |
|--------|-------------------------------|--------|---------------------------|
| GET    | /api/questions/test/:category | User   | Get random test questions |
| GET    | /api/questions                | Admin  | List all questions        |
| POST   | /api/questions                | Admin  | Create question           |
| PUT    | /api/questions/:id            | Admin  | Update question           |
| DELETE | /api/questions/:id            | Admin  | Delete question           |
| POST   | /api/questions/bulk           | Admin  | Bulk create (AI)          |

### Tests
| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | /api/tests/submit      | Submit completed test    |
| GET    | /api/tests/history     | User's test history      |
| GET    | /api/tests/progress    | Stats + chart data       |
| GET    | /api/tests/result/:id  | Single result detail     |

### Leaderboard
| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| GET    | /api/leaderboard     | Global rankings      |

### Admin
| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| GET    | /api/admin/stats              | Platform overview    |
| GET    | /api/admin/users              | List users           |
| PATCH  | /api/admin/users/:id/toggle   | Ban/unban user       |

### AI
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | /api/ai/generate  | Generate questions (Admin)|

---

## 🎮 Features

### 3D / Lite Mode
- Toggle in Navbar: `◈ 3D` ↔ `◇ LITE`
- 3D Mode: Three.js particles, floating shapes, parallax
- Lite Mode: CSS gradient background (better on mobile/old devices)
- Auto-detection: FPS < 20 → recommends Lite Mode
- Preference saved in `localStorage`

### Test System
- Random question selection per test session
- Random option order (shuffled per load)
- Per-question timer tracking
- Progress bar + question navigator dots
- Submit early or wait for timeout
- Automatic grading: A+ / A / B / C / D / F

### AI Question Generator (Admin)
1. Go to Admin → AI Generator tab
2. Enter a prompt: *"Generate 10 IELTS vocabulary questions about environment"*
3. Select category + count
4. Review generated questions
5. Check/uncheck to select
6. Click "Save Selected" to add to database

### Dashboard
- Score trend line chart
- Skills radar chart by category
- Quick start buttons
- Recent test history with grade

---

## 🌍 Test Categories

| Category          | Questions | Time  |
|-------------------|-----------|-------|
| General Knowledge | 30+       | 20min |
| English Vocabulary| 30+       | 20min |
| Grammar           | 30+       | 20min |
| Reading           | 30+       | 25min |
| Listening         | 30+       | 25min |
| IELTS Mock        | 40        | 60min |

---

## 🏭 Production Deployment

### Environment
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nexus
JWT_SECRET=<very-long-random-string>
CLIENT_URL=https://your-domain.com
```

### Build frontend
```bash
cd client
npm run build
# Serve /build folder via nginx or Express static
```

### Serve build from Express (add to server/index.js)
```js
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

---

## 🛠 Troubleshooting

**MongoDB connection error**
→ Make sure MongoDB is running: `mongod --dbpath /data/db`

**Port already in use**
→ Change PORT in `.env` or kill: `lsof -ti:5000 | xargs kill`

**AI not working**
→ Check OPENAI_API_KEY in `.env`. Must start with `sk-`

**3D background laggy**
→ Click `◇ LITE` toggle in navbar

**Questions not loading**
→ Run the seeder: `node database/seeder.js`

---

## 📝 License
MIT — Built for educational purposes.
