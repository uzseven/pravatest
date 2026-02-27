const { Telegraf } = require('telegraf');
const questions = require('./questions');

const BOT_TOKEN = '8728454241:AAGgph192eIAOZpR6VtfqkjrN7mkwQ58W88';
const DOMAIN = 'https://pravatest-1.onrender.com';
const PORT = process.env.PORT || 3000;

const bot = new Telegraf(BOT_TOKEN);

let userSessions = {};

// array shuffle (to‘g‘ri random, takrorlanmaydi)
function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// START
bot.start(async (ctx) => {
    await cleanChat(ctx);
    ctx.reply("Testni boshlash uchun tugmani bosing 👇", {
        reply_markup: {
            inline_keyboard: [[{ text: "Testni boshlash ♻️", callback_data: "start_test" }]]
        }
    });
});

// CALLBACK
bot.on('callback_query', async (ctx) => {
    const userId = ctx.from.id;

    if (!userSessions[userId]) {
        userSessions[userId] = { messages: [] };
    }

    const data = ctx.callbackQuery.data;

    // TESTNI BOSHLASH
    if (data === 'start_test') {

        await cleanChat(ctx);

        const shuffledQuestions = shuffle([...questions]).slice(0, 20);

        userSessions[userId] = {
            questions: shuffledQuestions,
            current: 0,
            score: 0,
            wrongAnswers: [],
            messages: []
        };

        await sendQuestion(ctx, userId);
    } 
    // TESTNI YAKUNLASH
    else if (data === 'finish_test') {
        const session = userSessions[userId];

        // Oxirgi savolni o'chirish
        if (session.messages.length > 0) {
            const lastMsgId = session.messages.pop();
            try {
                await ctx.telegram.deleteMessage(ctx.chat.id, lastMsgId);
            } catch {}
        }

        session.current = session.questions.length; // testni tugatish
        await ctx.answerCbQuery("Test yakunlandi❗️");
        await showResult(ctx, userId); // natijani ko‘rsatish
    }
    else {
        const session = userSessions[userId];
        const currentQ = session.questions[session.current];

        // Javob tekshirish
        if (data === currentQ.correct) {
            session.score++;
        } else {
            session.wrongAnswers.push({
                question: currentQ.question,
                userAnswer: data,
                correctAnswer: currentQ.correct
            });
        }

        // Oldingi savolni o'chirish
        if (session.messages.length > 0) {
            const lastMsgId = session.messages.pop();
            try {
                await ctx.telegram.deleteMessage(ctx.chat.id, lastMsgId);
            } catch {}
        }

        session.current++;

        // TEST TUGADI
        if (session.current >= session.questions.length) {
            await showResult(ctx, userId);
        } else {
            await sendQuestion(ctx, userId);
        }
    }

    await ctx.answerCbQuery();
});

// SAVOL YUBORISH
async function sendQuestion(ctx, userId) {
    const session = userSessions[userId];
    const q = session.questions[session.current];

    const shuffledOptions = shuffle([...q.options]);
    const optionButtons = shuffledOptions.map(o => [{ text: o, callback_data: o }]);

    // Testni yakunlash tugmasi har doim savol ostida
    optionButtons.push([{ text: "Testni yakunlash ✅", callback_data: "finish_test" }]);

    const sent = await ctx.reply(
        `Savol ${session.current + 1}/20\n\n${q.question}`,
        { reply_markup: { inline_keyboard: optionButtons } }
    );

    session.messages.push(sent.message_id);
}

// NATIJANI KO'RSATISH
async function showResult(ctx, userId) {
    const session = userSessions[userId];

    let resultText = `Test tugadi!\n\nNatija: ${session.score}/${session.questions.length}\n\n`;

    if (session.wrongAnswers.length > 0) {
        resultText += "❌ Xato javoblar:\n\n";
        session.wrongAnswers.forEach((w, i) => {
            resultText += `${i + 1}) ${w.question}\n`;
            resultText += `Sizning javobingiz: ${w.userAnswer}\n`;
            resultText += `To‘g‘ri javob: ${w.correctAnswer}\n\n`;
        });
    } else {
        resultText += "🎉 Barcha javoblar to‘g‘ri!";
    }

    const msg = await ctx.reply(resultText, {
        reply_markup: {
            inline_keyboard: [[{ text: "Testni boshlash ♻️", callback_data: "start_test" }]]
        }
    });

    session.messages.push(msg.message_id);
}

// CHAT TOZALASH
async function cleanChat(ctx) {
    const userId = ctx.from.id;

    if (userSessions[userId] && userSessions[userId].messages) {
        for (let msgId of userSessions[userId].messages) {
            try {
                await ctx.telegram.deleteMessage(ctx.chat.id, msgId);
            } catch {}
        }
        userSessions[userId].messages = [];
    }
}

// WEBHOOK
bot.launch({
    webhook: {
        domain: DOMAIN,
        port: PORT
    }
});

console.log("Bot ishga tushdi 🚀");
