
// questions.js
const questions = [];

// Savollar mavzulari (Yo‘l Harakati Qoidalari)
const baseQuestions = [
  {
    question: "Yo‘l belgilari nima uchun qo‘yiladi?",
    correct: "Harakatni tartibga solish uchun",
    wrong: [
      "Yo‘lni chiroyli qilish uchun",
      "Transport tezligini oshirish uchun",
      "Faqat dekoratsiya uchun"
    ]
  },
  {
    question: "Qizil svetofor chirog‘ida nima qilish kerak?",
    correct: "To‘xtash kerak",
    wrong: [
      "Davom etish mumkin",
      "Chapga burilsa bo‘ladi",
      "Faqat tezlikni oshirish kerak"
    ]
  },
  {
    question: "Haydovchi spirtli ichimlikdan keyin transport boshqarishi mumkinmi?",
    correct: "Yo‘q, mumkin emas",
    wrong: [
      "Faqat kichik yo‘llarda bo‘lsa mumkin",
      "Faqat tun bo‘lsa mumkin",
      "Faqat kichik mashinada bo‘lsa mumkin"
    ]
  },
  {
    question: "Piyodalar yo‘lagida transport harakatlanishi mumkinmi?",
    correct: "Yo‘q, mumkin emas",
    wrong: [
      "Faqat tez kelsa bo‘ladi",
      "Faqat svetofor yashil bo‘lsa",
      "Faqat tunda"
    ]
  },
  {
    question: "Chapga burilishdan oldin nima qilish kerak?",
    correct: "Yo‘l berish kerak",
    wrong: [
      "Tezlikni oshirish kerak",
      "Faqat gaz bermoq kerak",
      "Orqaga qarash shart emas"
    ]
  },
  {
    question: "Yo‘lni kesib o‘tishda kimga ustunlik beriladi?",
    correct: "Piyodalar uchun",
    wrong: [
      "Fakr yo‘l boshqaruvchiga",
      "Faqat yuk mashinalariga",
      "Faqat velosipedchilarga"
    ]
  },
  {
    question: "Tezlik cheklangan bo‘lsa, buning ma’nosi?",
    correct: "Belgilangan tezlikdan oshirmaslik",
    wrong: [
      "Hech narsa qilmaslik",
      "Faqat tunda tezlikni oshirish",
      "Faqat kichik mashinalarga"
    ]
  },
  {
    question: "Yo‘l belgisi: stop belgisi nimani anglatadi?",
    correct: "To‘xtash va yo‘l berish",
    wrong: [
      "Faqat vaqtinchalik to‘xtash",
      "Faqat tezligini oshirish",
      "Faqat chapga burilish"
    ]
  },
  {
    question: "Yo‘l chizig‘i uzundan cho‘zilgan oq chiziq nima anglatadi?",
    correct: "Chiziqlarni kesib o‘tish mumkin emas",
    wrong: [
      "Har doim to‘xtash kerak",
      "Faqat svetofor bo‘lsa o‘tish mumkin",
      "Faqat piyodalar o‘tgandan keyin"
    ]
  },
  {
    question: "Qaysi vaziyatda yangi tormoz masofasi uzun bo‘ladi?",
    correct: "Yo‘l sirpanchiq bo‘lsa",
    wrong: [
      "Fakr tez bo‘lmasa",
      "Faqat kunduzgi vaqt bo‘lsa",
      "Faqat suv tomchilar bo‘lsa"
    ]
  }
];

// 1200 ta savolni random variantlar bilan yaratish
for (let i = 0; i < 1200; i++) {
  // Tasodifiy asosiy savol tanlash
  const base = baseQuestions[Math.floor(Math.random() * baseQuestions.length)];

  // Option variantlarni aralashtirib olish
  const options = [
    base.correct,
    base.wrong[Math.floor(Math.random() * base.wrong.length)],
    base.wrong[Math.floor(Math.random() * base.wrong.length)],
    base.wrong[Math.floor(Math.random() * base.wrong.length)]
  ];

  // Variantlarni unique qilib aralashtirish
  const uniqueOpts = Array.from(new Set(options)).sort(() => 0.5 - Math.random());

  questions.push({
    question: `${i + 1}. ${base.question}`,
    options: uniqueOpts,
    correct: base.correct
  });
}

module.exports = questions;
