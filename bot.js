// bot.js
const { Telegraf } = require('telegraf');
const questions = require('./questions');

const BOT_TOKEN = '8728454241:AAGgph192eIAOZpR6VtfqkjrN7mkwQ58W88';
const DOMAIN = 'https://pravatest-1.onrender.com';
const PORT = process.env.PORT || 3000;

const bot = new Telegraf(BOT_TOKEN);
let userSessions = {};

// Start
bot.start(async (ctx) => {
    try { await ctx.deleteMessage(); } catch {}
    ctx.reply("Assalomu alaykum! Testni boshlash uchun tugmani bosing.", {
        reply_markup: {
            inline_keyboard: [[{ text: "Testni boshlash", callback_data: "start_test" }]]
        }
    });
});

// Callback handler
bot.on('callback_query', async (ctx) => {
    const userId = ctx.from.id;
    if (!userSessions[userId]) userSessions[userId] = {};

    if (ctx.callbackQuery.data === 'start_test') {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 20);

        userSessions[userId] = {
            questions: selected,
            current: 0,
            score: 0,
            lastMsg: null
        };

        await sendQuestion(ctx, userId);
    } else {
        const session = userSessions[userId];
        const currentQ = session.questions[session.current];

        if (ctx.callbackQuery.data === currentQ.correct) {
            session.score++;
        }

        session.current++;

        if (session.lastMsg) {
            try { await ctx.deleteMessage(session.lastMsg); } catch {}
        }

        if (session.current >= session.questions.length) {
            await ctx.reply(`Test tugadi!\nNatija: ${session.score}/${session.questions.length}`);
            await ctx.reply("Yana boshlash uchun tugmani bosing.", {
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

async function sendQuestion(ctx, userId) {
    const session = userSessions[userId];
    const q = session.questions[session.current];

    const buttons = q.options.map(o => [{ text: o, callback_data: o }]);
    const sent = await ctx.reply(
        `Savol ${session.current + 1}/${session.questions.length}:\n\n${q.question}`,
        { reply_markup: { inline_keyboard: buttons } }
    );

    session.lastMsg = sent.message_id;
}

bot.launch({
    webhook: {
        domain: DOMAIN,
        port: PORT
    }
});

console.log("Bot ishga tushdi 🚀");
