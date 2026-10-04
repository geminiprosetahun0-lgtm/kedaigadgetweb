import dotenv from 'dotenv';
import { createApiServer } from './api.js';
import { createTelegramBot } from './bot.js';
dotenv.config();
const PORT = process.env.PORT || process.env.API_PORT || 4000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const app = createApiServer();
app.listen(PORT, () => {
    console.log(`🚀 Backend API Server running at http://localhost:${PORT}`);
});
if (TELEGRAM_BOT_TOKEN) {
    try {
        createTelegramBot(TELEGRAM_BOT_TOKEN);
    }
    catch (err) {
        console.error('Failed to start Telegram Bot:', err);
    }
}
else {
    console.log('ℹ️ TELEGRAM_BOT_TOKEN is not configured in .env yet.');
    console.log('➡️ Silakan isi TELEGRAM_BOT_TOKEN di file .env untuk mengaktifkan bot.');
}
