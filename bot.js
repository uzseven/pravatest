const { Telegraf, Markup } = require("telegraf");
const questions = require("./questions"); // questions.js faylini shu joyda import qilamiz

// Bu yerga sizning bot tokeningizni qo'ying
const bot = new Telegraf("8728454241:AAGgph192eIAOZpR6VtfqkjrN7mkwQ58W88");

const userStates = {}; // Foydalanuvchi holatlarini saqlash uchun

// Start komandasi
bot.start((ctx) => {
  ctx.reply(
    "Salom! Siz prava imtihoniga tayyorlovchi botga kirdingiz.\n\nTestni boshlash uchun tugmani bosing.",
    Markup.inlineKeyboard([
      [Markup.button.callback("Testni boshlash", "START_TEST")]
    ])
  );
  userStates[ctx.from.id] = null; // Avval holatni tozalaymiz
});

// Testni boshlash tugmasi bosilganda
bot.action("START_TEST", async (ctx) => {
  const userId = ctx.from.id;

  // 1200 savoldan random 20 tanlaymiz
  const shuffled = questions.sort(() => 0.5 - Math.random());
  const testQuestions = shuffled.slice(0, 20);

  // Foydalanuvchi uchun holat yaratamiz
  userStates[userId] = {
    questions: testQuestions,
    current: 0,
    score: 0,
    messageIds: [] // keyinchalik message o'chirish uchun
  };

  // Birinchi savolni yuboramiz
  await sendQuestion(ctx, userId);
});

// Savolni yuboradigan funksiya
async function sendQuestion(ctx, userId) {
  const state = userStates[userId];
  if (!state) return;

  // Agar test tugagan bo'lsa
  if (state.current >= state.questions.length) {
    await ctx.reply(
      `Test tugadi!\nSiz ${state.score}/${state.questions.length} to'g'ri javob berdingiz.\n\nYana test ishlash uchun quyidagi tugmani bosing.`,
      Markup.inlineKeyboard([
        [Markup.button.callback("Testni boshlash", "START_TEST")]
      ])
    );
    userStates[userId] = null; // Holatni tozalaymiz
    return;
  }

  const q = state.questions[state.current];

  // Inline tugmalar yaratamiz
  const buttons = q.options.map((opt, i) => Markup.button.callback(opt, `ANSWER_${i}`));

  // Inline keyboard 2 ta ustunli bo'lishi uchun
  const keyboard = [];
  for (let i = 0; i < buttons.length; i += 2) {
    keyboard.push(buttons.slice(i, i + 2));
  }

  // Savol yuboriladi
  const message = await ctx.reply(
    `Savol ${state.current + 1}/${state.questions.length}:\n\n${q.question}`,
    Markup.inlineKeyboard(keyboard)
  );

  state.messageIds.push(message.message_id);
}

// Javobni tekshiradigan handler
bot.action(/ANSWER_(\d+)/, async (ctx) => {
  const userId = ctx.from.id;
  const state = userStates[userId];
  if (!state) return ctx.answerCbQuery();

  const selected = parseInt(ctx.match[1]);
  const q = state.questions[state.current];

  // Javob to'g'ri bo'lsa
  if (selected === q.correct) state.score++;

  state.current++;

  // Oldingi savolni o'chirib qo'yamiz
  for (const msgId of state.messageIds) {
    try {
      await ctx.deleteMessage(msgId);
    } catch (err) {}
  }
  state.messageIds = [];

  // Keyingi savolni yuboramiz
  await sendQuestion(ctx, userId);
});

// Botni ishga tushiramiz
bot.launch();
console.log("Bot ishga tushdi 🚀");

// Hot-reload uchun
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
