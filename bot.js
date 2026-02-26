const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log("Bot ishga tushdi 🚀");

// ====== TEST SAVOLLARI ======
const questions = [
  {
    text: "Qizil svetofor nimani anglatadi?",
    options: ["To‘xta", "Yurish mumkin", "Sekin yur", "Chapga buril"],
    correct: 0,
  },
  {
    text: "Piyodalar o‘tish joyida haydovchi nima qilishi kerak?",
    options: ["Tezlashishi", "Signal berishi", "To‘xtashi", "Burilishi"],
    correct: 2,
  },
  {
    text: "Sariq chiroq nimani bildiradi?",
    options: ["Tayyorlan", "To‘xta", "Erkin yur", "Chapga buril"],
    correct: 0,
  },
  {
    text: "Avtomagistralda maksimal tezlik?",
    options: ["70", "90", "110", "150"],
    correct: 2,
  },
  {
    text: "Qaysi belgi taqiqlovchi?",
    options: ["Qizil doira", "Yashil to‘rtburchak", "Ko‘k uchburchak", "Oq kvadrat"],
    correct: 0,
  }
];

// ====== USER SESSION ======
const userSessions = {};

// Random 20 savol (yoki mavjud bo‘lsa hammasi)
function getRandomQuestions() {
  return questions
    .sort(() => 0.5 - Math.random())
    .slice(0, 5); // hozir 5 ta, xohlasangiz 20 qiling
}

// ====== START ======
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "Salom! 👋\nPrava test botiga xush kelibsiz.\n\nTestni boshlash uchun tugmani bosing.",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Testni boshlash", callback_data: "start_test" }]
        ],
      },
    }
  );
});

// ====== CALLBACK ======
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  // ===== TEST BOSHLASH =====
  if (data === "start_test") {
    userSessions[chatId] = {
      current: 0,
      score: 0,
      questions: getRandomQuestions(),
    };

    const q = userSessions[chatId].questions[0];

    bot.editMessageText(
      `📘 Savol 1/${userSessions[chatId].questions.length}\n\n${q.text}`,
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: q.options.map((opt, i) => [
            { text: opt, callback_data: `ans_${i}` },
          ]),
        },
      }
    );
  }

  // ===== JAVOB BOSILGANDA =====
  if (data.startsWith("ans_")) {
    const session = userSessions[chatId];
    if (!session) return;

    const answerIndex = parseInt(data.split("_")[1]);
    const currentQuestion = session.questions[session.current];

    if (answerIndex === currentQuestion.correct) {
      session.score++;
    }

    session.current++;

    // ===== TEST TUGADI =====
    if (session.current >= session.questions.length) {
      return bot.editMessageText(
        `✅ Test tugadi!\n\n🎯 Natijangiz: ${session.score}/${session.questions.length}`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🔄 Testni yana boshlash",
                  callback_data: "start_test",
                },
              ],
            ],
          },
        }
      );
    }

    // ===== KEYINGI SAVOL =====
    const nextQ = session.questions[session.current];

    bot.editMessageText(
      `📘 Savol ${session.current + 1}/${session.questions.length}\n\n${nextQ.text}`,
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: nextQ.options.map((opt, i) => [
            { text: opt, callback_data: `ans_${i}` },
          ]),
        },
      }
    );
  }

  bot.answerCallbackQuery(query.id);
});
