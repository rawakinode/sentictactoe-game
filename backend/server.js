const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
const gameRouter = require('./routes/game');
app.use('/api', gameRouter);

// Simple root
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Senti TicTacToe Backend' });
});

app.listen(PORT, () => {
  console.log(`Senti TicTacToe backend running on port ${PORT}`);
});
