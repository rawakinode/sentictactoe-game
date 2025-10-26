const axios = require('axios');

class FireworksAIService {
  constructor() {
    this.apiKey = process.env.FIREWORKS_API_KEY || '';
    this.baseURL = 'https://api.fireworks.ai/inference/v1';
    // default model placeholder (replace with correct model path if needed)
    this.model = process.env.FIREWORKS_MODEL || 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new';
  }

  async getAIMove(gameState) {
    try {
      const prompt = this.createGamePrompt(gameState);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
        temperature: 0.1
      }, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Fireworks AI response shape may vary; try to parse safely
      const content = response.data?.choices?.[0]?.message?.content || response.data?.message || '';
      return this.parseAIResponse(String(content));
    } catch (error) {
      console.error('Fireworks AI Error:', error.response?.data || error.message || error);
      // throw to let route handle fallback
      throw new Error('Failed to get AI move');
    }
  }

  createGamePrompt(gameState) {
    const { board, currentPlayer, moveHistory } = gameState;
    return `Anda adalah pemain Tic-Tac-Toe ahli. Posisi papan saat ini (0-8):\n${this.formatBoard(board)}\nPemain saat ini: ${currentPlayer}\nSejarah langkah: ${JSON.stringify(moveHistory)}\n\nAnalisis posisi dan kembalikan HANYA nomor kotak (0-8) untuk langkah terbaik. Format respon: \"MOVE:X\" dimana X adalah angka 0-8.`;
  }

  formatBoard(board) {
    let formatted = '';
    for (let i = 0; i < 9; i += 3) {
      formatted += `${board[i] ?? i} | ${board[i+1] ?? i+1} | ${board[i+2] ?? i+2}\n`;
      if (i < 6) formatted += '---------\n';
    }
    return formatted;
  }

  parseAIResponse(response) {
    const moveMatch = response.match(/MOVE:\s*(\d)/i);
    if (moveMatch) {
      return parseInt(moveMatch[1], 10);
    }
    // Fallback: find a single digit 0-8
    const numberMatch = response.match(/\b[0-8]\b/);
    if (numberMatch) return parseInt(numberMatch[0], 10);
    return this.getRandomMove();
  }

  getRandomMove() {
    return Math.floor(Math.random() * 9);
  }
}

module.exports = FireworksAIService;
