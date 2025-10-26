# Senti TicTacToe

Fullstack demo: React (Vite) frontend + Express backend integrated with Fireworks AI.

Structure

senti-tictactoe/
├── frontend/                 # Vite React application
└── backend/                  # Express.js server

Quick setup (Windows PowerShell)

Backend

```powershell
cd backend
npm install
# copy .env.example to .env and add your FIREWORKS_API_KEY
copy .env.example .env
# edit .env and set FIREWORKS_API_KEY
npm run dev

Optional: Use built-in Minimax (perfect TicTacToe) instead of Fireworks AI by setting `USE_FIREWORKS=false` in your `.env`. If you want to use Fireworks but keep safety checks, set `USE_FIREWORKS=true` and provide `FIREWORKS_API_KEY`.
```

Frontend

```powershell
cd frontend
npm install
npm run dev
```

Notes
- Backend expects FIREWORKS_API_KEY; without it AI calls will fail and the server will fallback to an error response. The frontend also has a fallback random-move behavior when the backend is unavailable.
- The Fireworks AI model path is set in `.env` as FIREWORKS_MODEL if you need to change it.
