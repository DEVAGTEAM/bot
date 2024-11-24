const { Telegraf } = require('telegraf');

const bot = new Telegraf('7711650034:AAEtcPtYIg5kbj99-KQ2eKMTYfZ1SU3TneI');

// Track user scores
const scores = {};

// Start command
bot.start((ctx) => {
  ctx.reply('Welcome to TapTap! Tap the button below as fast as you can!', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Tap!', callback_data: 'tap' }]],
    },
  });
});

// Handle tap action
bot.action('tap', (ctx) => {
  const userId = ctx.from.id;
  const userName = ctx.from.first_name;

  // Increment score
  if (!scores[userId]) scores[userId] = 0;
  scores[userId] += 1;

  // Send updated score
  ctx.answerCbQuery(`Nice tap, ${userName}! Your score: ${scores[userId]}`);
  ctx.editMessageReplyMarkup({
    inline_keyboard: [[{ text: 'Tap!', callback_data: 'tap' }]],
  });
});

// Handle score command
bot.command('score', (ctx) => {
  const userId = ctx.from.id;
  const score = scores[userId] || 0;
  ctx.reply(`Your current score: ${score}`);
});

// Handle leaderboard
bot.command('leaderboard', (ctx) => {
  const leaderboard = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, score], index) => `${index + 1}. ${id}: ${score}`)
    .join('\n');

  ctx.reply(leaderboard || 'No scores yet!');
});

// Launch the bot
bot.launch().then(() => {
  console.log('Bot is running!');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
