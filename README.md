# 🎮 Senti TicTacToe

A modern implementation of TicTacToe featuring an AI opponent powered by Sentient Foundation's Dobby Unhinged LLaMA 3 70B model. Experience strategic gameplay against one of the most advanced language models trained for tactical decision making!

🎮 **[Play Now: https://sentictactoe-game.vercel.app/](https://sentictactoe-game.vercel.app/)**

## ✨ Features

- 🤖 AI opponent powered by Sentient's Dobby Unhinged LLaMA 3 70B
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
- Sentient AI model integration via Fireworks API
- Advanced move analysis system
- Strategic caching for consistent performance
- Pattern recognition and tactical planning

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- API key from Fireworks platform (for accessing Sentient's model)

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

The development server will be available at `http://localhost:5173`

## 🌐 Live Demo

The game is deployed and available online at:
- **[https://sentictactoe-game.vercel.app/](https://sentictactoe-game.vercel.app/)**

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
FIREWORKS_API_KEY=your_api_key_here
FIREWORKS_MODEL=accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new  # Sentient's strategic gaming model
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001  # Backend API URL
```

### About the AI Model

The game uses Sentient Foundation's Dobby Unhinged LLaMA 3 70B, a specialized variant of LLaMA fine-tuned for strategic gaming and tactical decision making. This model excels at:
- Pattern recognition in game states
- Strategic position evaluation
- Tactical move planning
- Adaptive gameplay based on opponent patterns

## 🎮 How to Play

1. Open the game in your browser
2. You play as X (represented by player icon)
3. Click any empty cell to make your move
4. The AI opponent (O) will respond with its move
5. Continue until someone wins or the game draws
6. Click "Play Again" to start a new game

## 🧠 AI Capabilities

### Advanced Decision Making
- Deep strategic analysis using Sentient's neural architecture
- Pattern recognition from extensive game training
- Dynamic difficulty adaptation
- Real-time position evaluation

### Tactical Features
- Winning sequence identification
- Counter-move prediction
- Fork creation and prevention
- Advanced board state analysis
- Multi-step move planning

### Performance Optimization
- Move caching system
- Quick response failsafe
- Position evaluation memory
- Strategic pattern database

## 🔒 Reliability System

The game includes a sophisticated reliability system:
1. Primary: Sentient AI strategic analysis
2. Secondary: Pattern-based tactical moves
3. Tertiary: Position-based strategic decisions
4. Fallback: Guaranteed valid move selection

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
