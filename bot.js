const { Telegraf, Markup } = require('telegraf');
const questions = require('./questions');

const bot = new Telegraf(process.env.BOT_TOKEN); // TOKEN Environment Variable orqali olinadi

const sessions = {};

function getRandomQuestions(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// /start
bot.start((ctx) => {
    ctx.reply(
        "Prava test botiga xush kelibsiz 🚗",
        Markup.keyboard([["Testni boshlash"]]).resize()
    );
});

// Testni boshlash
bot.hears("Testni boshlash", async (ctx) => {
    const chatId = ctx.chat.id;

    if (sessions[chatId] && sessions[chatId].resultMessageId) {
        try {
            await ctx.deleteMessage(sessions[chatId].resultMessageId);
        } catch {}
    }

    const randomQuestions = getRandomQuestions(questions, 20);

    sessions[chatId] = {
        questions: randomQuestions,
        current: 0,
        score: 0,
        messageId: null,
        resultMessageId: null
    };

    sendQuestion(ctx, chatId);
});

async function sendQuestion(ctx, chatId) {
    const session = sessions[chatId];
    const q = session.questions[session.current];

    const buttons = q.options.map(opt => [Markup.button.callback(opt, opt)]);
    const keyboard = Markup.inlineKeyboard(buttons);

    if (q.image) {
        const sent = await ctx.replyWithPhoto(
            { source: q.image },
            { caption: `Savol ${session.current + 1}/20\n\n${q.question}`, ...keyboard }
        );
        session.messageId = sent.message_id;
    } else {
        const sent = await ctx.reply(
            `Savol ${session.current + 1}/20\n\n${q.question}`,
            keyboard
        );
        session.messageId = sent.message_id;
    }
}

bot.on("callback_query", async (ctx) => {
    const chatId = ctx.chat.id;
    const session = sessions[chatId];
    const q = session.questions[session.current];
    const answer = ctx.update.callback_query.data;

    if (answer === q.correct) session.score++;
    session.current++;

    ctx.answerCbQuery();

    if (session.current < session.questions.length) {
        sendQuestion(ctx, chatId);
    } else {
        const resultMessage = await ctx.reply(`✅ Test tugadi!\nNatija: ${session.score}/20`);
        session.resultMessageId = resultMessage.message_id;

        await ctx.reply(
            "Yana test ishlash uchun tugmani bosing",
            Markup.keyboard([["Testni boshlash"]]).resize()
        );

        delete sessions[chatId].questions;
        delete sessions[chatId].current;
        delete sessions[chatId].score;
        delete sessions[chatId].messageId;
    }
});

bot.launch();
console.log("Bot ishga tushdi 🚀");
