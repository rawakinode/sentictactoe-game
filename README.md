# 🎮 Senti TicTacToe

A modern implementation of TicTacToe featuring an AI opponent powered by Fireworks AI. Play against an AI that learns and adapts to your strategy!

## ✨ Features

- 🤖 AI opponent powered by Fireworks AI
- 🎯 Strategic fallback system for consistent gameplay
- 📊 Game statistics tracking
- 💫 Smooth animations and modern UI
- 🎨 SVG icons for X's and O's
- 🏆 Victory celebrations with confetti effects
- 💾 Game state persistence

## 🏗️ Tech Stack

### Frontend
- React with Vite
- Modern CSS animations
- LocalStorage for game persistence
- SVG animations
- Responsive design

### Backend
- Express.js
- Fireworks AI integration
- Strategic fallback system
- Move caching for performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Fireworks AI API key ([Get one here](https://fireworks.ai))

### Backend Setup

```powershell
cd backend
npm install

# Create .env file and set your API key
copy .env.example .env
# Edit .env and add your FIREWORKS_API_KEY

# Start the development server
npm run dev
```

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

The game will be available at `http://localhost:5173`

## ⚙️ Configuration

### Environment Variables (.env)

```env
FIREWORKS_API_KEY=your_api_key_here
FIREWORKS_MODEL=accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new
```

## 🎮 How to Play

1. Open the game in your browser
2. You play as X (represented by player icon)
3. Click any empty cell to make your move
4. The AI opponent (O) will respond with its move
5. Continue until someone wins or the game draws
6. Click "Play Again" to start a new game

## 🧠 AI Features

- Move analysis and prediction
- Strategic position evaluation
- Winning move detection
- Blocking opponent's winning moves
- Fork opportunity detection
- Move caching for performance

## 🔒 Fallback System

The game includes a robust fallback system:
1. Primary: Fireworks AI decision making
2. Secondary: Strategic position-based moves
3. Final: Random valid move selection

## 📈 Statistics

The game tracks:
- Wins
- Losses
- Draws
- Total games
- Win rate percentage

## 💻 Development

### Project Structure

```
senti-tictactoe/
├── frontend/                 # Vite React application
│   ├── src/
│   │   ├── hooks/           # Custom React hooks
│   │   ├── assets/          # SVG icons and images
│   │   └── components/      # React components
└── backend/                  # Express.js server
    ├── services/            # AI and game services
    └── routes/              # API endpoints
```

### API Endpoints

- `POST /api/ai-move` - Get AI's next move
- `GET /api/health` - Service health check

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for learning and development!
