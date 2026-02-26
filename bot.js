const { Telegraf, Markup } = require('telegraf');
const questions = require('./questions'); // Sizning 1200 ta savol faylingiz
const bot = new Telegraf('8728454241:AAGgph192eIAOZpR6VtfqkjrN7mkwQ58W88'); // TOKEN ni almashtiring

// Foydalanuvchilar uchun vaqtinchalik holat saqlash
const users = {};

// Start tugmasi
bot.start((ctx) => {
  ctx.reply(
    `Assalomu alaykum! Testga tayyorlanamiz.\n\n"Testni boshlash" tugmasini bosing.`,
    Markup.inlineKeyboard([[Markup.button.callback('Testni boshlash', 'start_test')]])
  );
});

// Testni boshlash tugmasi bosilganda
bot.action('start_test', async (ctx) => {
  const userId = ctx.from.id;
  // Foydalanuvchi holatini yaratish
  users[userId] = {
    score: 0,
    current: 0,
    questions: shuffle(questions).slice(0, 20) // Random 20 savol
  };

  await ctx.deleteMessage(); // oldingi tugmani o‘chirish
  sendQuestion(ctx, userId);
});

// Savolni yuborish funksiyasi
async function sendQuestion(ctx, userId) {
  const user = users[userId];
  const q = user.questions[user.current];

  const buttons = q.options.map((opt) => Markup.button.callback(opt, `answer_${opt}`));
  const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

  if (q.image) {
    await ctx.replyWithPhoto({ url: q.image }, { caption: `Savol ${user.current + 1}/20\n\n${q.question}`, reply_markup: keyboard.reply_markup });
  } else {
    await ctx.reply(`Savol ${user.current + 1}/20\n\n${q.question}`, keyboard);
  }
}

// Javob tugmasi bosilganda
bot.action(/answer_(.+)/, async (ctx) => {
  const userId = ctx.from.id;
  const user = users[userId];
  const answer = ctx.match[1];
  const q = user.questions[user.current];

  if (!user) return ctx.answerCbQuery('Testni boshlang.');

  if (answer === q.correct) user.score++;

  user.current++;

  await ctx.deleteMessage(); // oldingi savolni o‘chirish

  if (user.current < user.questions.length) {
    sendQuestion(ctx, userId);
  } else {
    // Test tugadi
    await ctx.reply(`Test tugadi! Siz ${user.score}/${user.questions.length} to‘g‘ri javob berdingiz.`);
    await ctx.reply(
      `Yana testni boshlash uchun tugmani bosing.`,
      Markup.inlineKeyboard([[Markup.button.callback('Testni boshlash', 'start_test')]])
    );
    delete users[userId]; // foydalanuvchi holatini tozalash
  }

  await ctx.answerCbQuery(); // tugmani bosgan signalni olib tashlash
});

// Random array
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

bot.launch().then(() => console.log('Bot ishga tushdi 🚀'));
