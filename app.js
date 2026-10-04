import dotenv from 'dotenv';
import { createApiServer } from './dist-server/api.js';
import { createTelegramBot } from './dist-server/bot.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

const app = createApiServer();

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

if (TELEGRAM_BOT_TOKEN) {
  try {
    createTelegramBot(TELEGRAM_BOT_TOKEN);
    console.log('Telegram Bot started successfully');
  } catch (err) {
    console.error('Failed to start Telegram Bot:', err);
  }
} else {
  console.log('TELEGRAM_BOT_TOKEN not found');
}
