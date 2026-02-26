// bot.js
const { Telegraf } = require('telegraf');
const questions = require('./questions');

const BOT_TOKEN = '8728454241:AAGgph192eIAOZpR6VtfqkjrN7mkwQ58W88';  // Telegram bot tokeningizni qo‘ying
const PORT = process.env.PORT || 3000;   // Railway sizga port beradi
const DOMAIN = 'https://SIZNING_APP.onrender.com'; // Railway app URL

const bot = new Telegraf(BOT_TOKEN);

let userSessions = {}; // foydalanuvchi sessionlarini saqlash

// Start komandasi
bot.start((ctx) => {
    ctx.reply("Assalomu alaykum! Testni boshlash uchun pastdagi tugmani bosing.", {
        reply_markup: {
            inline_keyboard: [[{ text: "Testni boshlash", callback_data: "start_test" }]]
        }
    });
});

// Callback handler
bot.on('callback_query', async (ctx) => {
    const userId = ctx.from.id;

    if (!userSessions[userId]) {
        userSessions[userId] = { current: 0, score: 0 };
    }

    if (ctx.callbackQuery.data === 'start_test') {
        userSessions[userId] = { current: 0, score: 0 };
        await sendQuestion(ctx, userId);
    } else {
        // Javobni tekshirish
        const session = userSessions[userId];
        const currentQ = questions[session.current];

        if (ctx.callbackQuery.data === currentQ.correct) {
            session.score++;
        }

        session.current++;

        if (session.current >= 20) {
            await ctx.editMessageText(`Test tugadi!\nNatija: ${session.score}/20`);
            await ctx.reply("Yana testni boshlash uchun tugmani bosing.", {
                reply_markup: {
                    inline_keyboard: [[{ text: "Testni boshlash", callback_data: "start_test" }]]
                }
            });
        } else {
            await sendQuestion(ctx, userId);
        }
    }

    await ctx.answerCbQuery();
});

// Savolni yuborish funksiyasi
async function sendQuestion(ctx, userId) {
    const session = userSessions[userId];
    const q = questions[session.current];

    const optionsButtons = q.options.map(opt => [{ text: opt, callback_data: opt }]);

    await ctx.reply(
        `Savol ${session.current + 1}/20:\n\n${q.question}`,
        {
            reply_markup: { inline_keyboard: optionsButtons }
        }
    );
}

// Webhook bilan launch
bot.launch({
    webhook: {
        domain: DOMAIN,
        port: PORT
    }
});

console.log("Bot ishga tushdi 🚀");
